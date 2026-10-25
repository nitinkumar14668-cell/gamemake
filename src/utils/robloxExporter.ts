import { RobloxObject } from '../types/studio';

/**
 * Utility to convert Hex color (#RRGGBB) to Roblox Color3uint8 integer
 * Format: 0xFF000000 | (R << 16) | (G << 8) | B
 */
function hexToColor3uint8(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2) || 'FF', 16);
  const g = parseInt(clean.substring(2, 4) || 'FF', 16);
  const b = parseInt(clean.substring(4, 6) || 'FF', 16);
  return 0xff000000 | (r << 16) | (g << 8) | b;
}

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2) || 'FF', 16) / 255;
  const g = parseInt(clean.substring(2, 4) || 'FF', 16) / 255;
  const b = parseInt(clean.substring(4, 6) || 'FF', 16) / 255;
  return [Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3))];
}

/**
 * Converts material string to Roblox Material Token ID
 */
function materialToToken(mat: string): number {
  switch (mat) {
    case 'SmoothPlastic': return 256;
    case 'Neon': return 288;
    case 'Wood': return 512;
    case 'Metal': return 1088;
    case 'Grass': return 1280;
    case 'Glass': return 1568;
    case 'Brick': return 816;
    case 'Forcefield': return 1536;
    case 'Foil': return 1072;
    case 'Ice': return 1552;
    default: return 256;
  }
}

/**
 * Generates official Roblox Studio XML Model (.rbxmx) format
 * Compatible with Roblox Studio "Insert from File..." and drag & drop!
 */
export function generateRobloxRbxmx(placeName: string, objects: RobloxObject[]): string {
  let referentCounter = 1;

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
	<Meta name="ExplicitAutoJoints">true</Meta>
	<External>null</External>
	<External>nil</External>
	<Item class="Model" referent="RBX${referentCounter++}">
		<Properties>
			<string name="Name">${escapeXml(placeName || 'ExportedRobloxGame')}</string>
		</Properties>
`;

  // Always include a classic Baseplate if not present
  const hasBaseplate = objects.some((o) => o.name.toLowerCase().includes('baseplate'));
  if (!hasBaseplate) {
    xml += `		<Item class="Part" referent="RBX${referentCounter++}">
			<Properties>
				<string name="Name">Baseplate</string>
				<CoordinateFrame name="CFrame">
					<X>0</X><Y>-1</Y><Z>0</Z>
					<R00>1</R00><R01>0</R01><R02>0</R02>
					<R10>0</R10><R11>1</R11><R12>0</R12>
					<R20>0</R20><R21>0</R21><R22>1</R22>
				</CoordinateFrame>
				<Vector3 name="size">
					<X>512</X><Y>2</Y><Z>512</Z>
				</Vector3>
				<Color3uint8 name="Color3uint8">${hexToColor3uint8('#63666A')}</Color3uint8>
				<token name="Material">256</token>
				<bool name="Anchored">true</bool>
				<bool name="CanCollide">true</bool>
				<bool name="Locked">true</bool>
				<float name="Transparency">0</float>
			</Properties>
		</Item>
`;
  }

  // Iterate objects
  for (const obj of objects) {
    const isSpawn = obj.type === 'SpawnLocation' || obj.behaviorType === 'spawn';
    const className = isSpawn ? 'SpawnLocation' : obj.subParts && obj.subParts.length > 0 ? 'Model' : 'Part';
    const refId = `RBX${referentCounter++}`;

    if (className === 'Model') {
      // Composite model
      xml += `		<Item class="Model" referent="${refId}">
			<Properties>
				<string name="Name">${escapeXml(obj.name)}</string>
			</Properties>
`;
      // Main root part
      xml += generatePartXml(obj, `RBX${referentCounter++}`, true);

      // Subparts
      if (obj.subParts) {
        for (const sp of obj.subParts) {
          const subObj: RobloxObject = {
            id: sp.id,
            name: sp.name,
            type: 'Part',
            shape: sp.shape,
            position: [
              obj.position[0] + sp.offset[0],
              obj.position[1] + sp.offset[1],
              obj.position[2] + sp.offset[2],
            ],
            rotation: [
              obj.rotation[0] + sp.rotation[0],
              obj.rotation[1] + sp.rotation[1],
              obj.rotation[2] + sp.rotation[2],
            ],
            size: sp.size,
            color: sp.color,
            material: sp.material,
            anchored: true,
            canCollide: sp.canCollide ?? true,
            transparency: sp.transparency ?? 0,
            reflectance: 0,
            castShadow: true,
          };
          xml += generatePartXml(subObj, `RBX${referentCounter++}`);
        }
      }

      xml += `		</Item>
`;
    } else {
      xml += generatePartXml(obj, refId, false, isSpawn ? 'SpawnLocation' : 'Part');
    }
  }

  xml += `	</Item>
</roblox>`;

  return xml;
}

function generatePartXml(obj: RobloxObject, refId: string, isInsideModel = false, explicitClass = 'Part'): string {
  const indent = isInsideModel ? '\t\t\t' : '\t\t';
  const colorUint = hexToColor3uint8(obj.color);
  const materialToken = materialToToken(obj.material);

  let shapeToken = 1; // 1 = Block, 0 = Ball, 2 = Cylinder
  if (obj.shape === 'Ball') shapeToken = 0;
  if (obj.shape === 'Cylinder') shapeToken = 2;

  let str = `${indent}<Item class="${explicitClass}" referent="${refId}">
${indent}	<Properties>
${indent}		<string name="Name">${escapeXml(obj.name)}</string>
${indent}		<CoordinateFrame name="CFrame">
${indent}			<X>${obj.position[0]}</X><Y>${obj.position[1]}</Y><Z>${obj.position[2]}</Z>
${indent}			<R00>1</R00><R01>0</R01><R02>0</R02>
${indent}			<R10>0</R10><R11>1</R11><R12>0</R12>
${indent}			<R20>0</R20><R21>0</R21><R22>1</R22>
${indent}		</CoordinateFrame>
${indent}		<Vector3 name="size">
${indent}			<X>${obj.size[0]}</X><Y>${obj.size[1]}</Y><Z>${obj.size[2]}</Z>
${indent}		</Vector3>
${indent}		<Color3uint8 name="Color3uint8">${colorUint}</Color3uint8>
${indent}		<token name="Material">${materialToken}</token>
${indent}		<token name="shape">${shapeToken}</token>
${indent}		<bool name="Anchored">${obj.anchored}</bool>
${indent}		<bool name="CanCollide">${obj.canCollide}</bool>
${indent}		<bool name="CastShadow">${obj.castShadow}</bool>
${indent}		<float name="Transparency">${obj.transparency}</float>
${indent}		<float name="Reflectance">${obj.reflectance}</float>
${indent}	</Properties>
`;

  // Attach Lua script if present
  if (obj.scriptCode && obj.scriptCode.trim()) {
    str += `${indent}	<Item class="Script" referent="${refId}_script">
${indent}		<Properties>
${indent}			<string name="Name">${escapeXml(obj.name)}Script</string>
${indent}			<ProtectedString name="Source"><![CDATA[${obj.scriptCode}]]></ProtectedString>
${indent}		</Properties>
${indent}	</Item>
`;
  }

  str += `${indent}</Item>
`;
  return str;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Generates a ready-to-run Roblox Studio Command Bar Lua script.
 * When pasted into Roblox Studio's command bar, this builds the entire place in 1 second!
 */
export function generateRobloxStudioCommandScript(placeName: string, objects: RobloxObject[]): string {
  let lua = `-- ==========================================================
-- ROBLOX STUDIO 1-CLICK MAP BUILDER
-- Game: "${placeName}"
-- Paste this script into Roblox Studio's Command Bar (View > Command Bar)
-- and press Enter. All parts, models, and scripts will be created instantly!
-- ==========================================================

local Workspace = game:GetService("Workspace")
local mapFolder = Instance.new("Folder")
mapFolder.Name = "${placeName.replace(/"/g, '\\"')}"
mapFolder.Parent = Workspace

print("[Roblox Studio Importer] Building map: ${placeName}...")

`;

  objects.forEach((obj, idx) => {
    const varName = `obj_${idx}`;
    const [r, g, b] = hexToRgb01(obj.color);
    const className = obj.type === 'SpawnLocation' ? 'SpawnLocation' : 'Part';

    lua += `do
    local ${varName} = Instance.new("${className}")
    ${varName}.Name = "${obj.name.replace(/"/g, '\\"')}"
    ${varName}.Size = Vector3.new(${obj.size[0]}, ${obj.size[1]}, ${obj.size[2]})
    ${varName}.Position = Vector3.new(${obj.position[0]}, ${obj.position[1]}, ${obj.position[2]})
    ${varName}.Orientation = Vector3.new(${obj.rotation[0]}, ${obj.rotation[1]}, ${obj.rotation[2]})
    ${varName}.Color = Color3.new(${r}, ${g}, ${b})
    ${varName}.Material = Enum.Material.${obj.material || 'SmoothPlastic'}
    ${varName}.Anchored = ${obj.anchored}
    ${varName}.CanCollide = ${obj.canCollide}
    ${varName}.Transparency = ${obj.transparency}
    ${varName}.Reflectance = ${obj.reflectance}
    ${varName}.CastShadow = ${obj.castShadow}
    ${varName}.Parent = mapFolder
`;

    // Shape
    if (obj.shape === 'Ball') {
      lua += `    ${varName}.Shape = Enum.PartType.Ball\n`;
    } else if (obj.shape === 'Cylinder') {
      lua += `    ${varName}.Shape = Enum.PartType.Cylinder\n`;
    }

    // SubParts if composite
    if (obj.subParts && obj.subParts.length > 0) {
      obj.subParts.forEach((sp, spIdx) => {
        const spVar = `sub_${idx}_${spIdx}`;
        const [sr, sg, sb] = hexToRgb01(sp.color);
        lua += `
    local ${spVar} = Instance.new("Part")
    ${spVar}.Name = "${sp.name}"
    ${spVar}.Size = Vector3.new(${sp.size[0]}, ${sp.size[1]}, ${sp.size[2]})
    ${spVar}.Position = ${varName}.Position + Vector3.new(${sp.offset[0]}, ${sp.offset[1]}, ${sp.offset[2]})
    ${spVar}.Color = Color3.new(${sr}, ${sg}, ${sb})
    ${spVar}.Material = Enum.Material.${sp.material || 'SmoothPlastic'}
    ${spVar}.Anchored = true
    ${spVar}.CanCollide = ${sp.canCollide ?? true}
    ${spVar}.Parent = ${varName}
`;
      });
    }

    // Script attachment
    if (obj.scriptCode && obj.scriptCode.trim()) {
      lua += `
    local scriptObj = Instance.new("Script")
    scriptObj.Name = "${obj.name}Script"
    scriptObj.Source = [==[\n${obj.scriptCode}\n]==]
    scriptObj.Parent = ${varName}
`;
    }

    lua += `end\n\n`;
  });

  lua += `print("[Roblox Studio Importer] Map created successfully with ${objects.length} parts and scripts!")\n`;
  return lua;
}
