import { $ } from "bun";

await Promise.all([
    $`<first command>`,
    $`<second command>`
])