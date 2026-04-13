import { existsSync, copySync, writeFileSync, readFileSync, mkdirSync } from "fs-extra";
import { input } from "@inquirer/prompts";
import { execSync } from "child_process";
import path from "path";

const PACKAGES_FOLDER = path.resolve(__dirname, "..", "..", "packages");

export async function newPackage() {
    let npmUser: string;
    try {
        npmUser = execSync("npm whoami", { stdio: "pipe", encoding: "utf-8" }).trim();
    } catch {
        console.log("\n❌ Not logged in to npm. Run `npm adduser` first.\n");
        return;
    }

    const orgMembers = JSON.parse(
        execSync("npm org ls cantus --json", { stdio: "pipe", encoding: "utf-8" }),
    ) as Record<string, string>;

    if (!(npmUser in orgMembers)) {
        console.log(`\n❌ npm user "${npmUser}" is not a member of the @cantus organization.\n`);
        return;
    }

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
    const rootDir = path.resolve(__dirname, "..", "..");

    mkdirSync(newPackagePath);
    mkdirSync(path.resolve(newPackagePath, "src"));
    copySync(path.resolve(templatePackagePath, "src"), path.resolve(newPackagePath, "src"));
    copySync(path.resolve(templatePackagePath, "vite.config.ts"), path.resolve(newPackagePath, "vite.config.ts"));
    copySync(path.resolve(templatePackagePath, "tsconfig.json"), path.resolve(newPackagePath, "tsconfig.json"));

    const packageJson = readFileSync(path.resolve(templatePackagePath, "package.json"), "utf-8");
    writeFileSync(path.resolve(newPackagePath, "package.json"), packageJson.replace("@cantus/template", packageName));

    console.log("\nInstalling workspace dependencies...");
    execSync("pnpm install", { cwd: rootDir, stdio: "inherit" });

    console.log(`\nBuilding ${packageName}...`);
    execSync("pnpm run build", { cwd: newPackagePath, stdio: "inherit" });

    console.log(`\nPublishing ${packageName}@0.0.1...`);
    execSync("pnpm publish --access public --no-git-checks", { cwd: newPackagePath, stdio: "inherit" });

    console.log(`\n✅ Published ${packageName}@0.0.1`);
    console.log(`\n🔒 Set up trusted publishing for this package:`);
    console.log(`   https://www.npmjs.com/package/${packageName}/access\n`);
}
