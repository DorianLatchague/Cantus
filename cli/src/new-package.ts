import { existsSync, copySync, writeFileSync, readFileSync, mkdirSync } from "fs-extra";
import { input } from "@inquirer/prompts";
import path from "path";

const PACKAGES_FOLDER = path.resolve(__dirname, "..", "..", "packages");

export async function newPackage() {
    const name = await input({
        message: "Enter package name",
        required: true,
        validate: (inputName) => {
            if (!/^[a-z0-9-]*$/.test(inputName)) {
                return "Only lowercase letters, digits and dashes are allowed";
            }
            if (existsSync(path.resolve(PACKAGES_FOLDER, inputName))) {
                return "New package specified already exists";
            }
            return true;
        },
    });

    const templatePackagePath = path.resolve(PACKAGES_FOLDER, "template");
    const newPackagePath = path.resolve(PACKAGES_FOLDER, name);
    const packageName = `@cantus/${name}`;

    mkdirSync(newPackagePath);
    mkdirSync(path.resolve(newPackagePath, "src"));
    copySync(path.resolve(templatePackagePath, "src"), path.resolve(newPackagePath, "src"));
    copySync(path.resolve(templatePackagePath, "vite.config.ts"), path.resolve(newPackagePath, "vite.config.ts"));
    copySync(path.resolve(templatePackagePath, "tsconfig.json"), path.resolve(newPackagePath, "tsconfig.json"));

    const packageJson = readFileSync(path.resolve(templatePackagePath, "package.json"), "utf-8");
    writeFileSync(path.resolve(newPackagePath, "package.json"), packageJson.replace("@cantus/template", packageName));
}
