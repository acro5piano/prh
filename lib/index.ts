import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

import * as raw from "./raw";
import Engine from "./engine";

export { Engine };

export function fromYAMLFilePath(configPath: string): Engine {
    let content = fs.readFileSync(configPath, { encoding: "utf8" });
    return fromYAML(configPath, content);
}

export function fromYAML(configPath: string, yamlContent: string): Engine {
    let rawConfig = yaml.load(yamlContent);
    return fromRowConfig(configPath, rawConfig);
}

export function fromRowConfig(configPath: string, rawConfig: raw.Config): Engine {
    let engine = new Engine(rawConfig);

    if (rawConfig.imports) {
        let tmp = rawConfig.imports;
        let imports = typeof tmp === "string" ? [tmp] : tmp;
        imports.forEach(im => {
            let importedConfigPath = path.resolve(path.dirname(configPath), im);
            let newEngine = fromYAMLFilePath(importedConfigPath);
            engine.merge(newEngine);
        });
    }

    return engine;
}
