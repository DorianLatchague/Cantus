import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { noop } from "lodash";
import { exit } from "process";
import { newPackage } from "./new-package";

yargs(hideBin(process.argv))
    .command("new package", "create a new package", noop, () => newPackage())
    .demandCommand(1)
    .parseAsync()
    .catch(() => exit(1));
