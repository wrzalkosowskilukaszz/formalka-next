// Prints the rules from past mistakes that concern the given files, to paste into a task's prompt.
// Usage: node tools/lessons/slice.mjs <path>...   |   --staged   |   --diff <ref> (changed since <ref>, and uncommitted)
import { execSync } from 'node:child_process';
import { ROOT, load, slice, sliceText } from './lessons.mjs';

const args = process.argv.slice(2);
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT }).toString().split('\n').filter(Boolean);
let paths = args.filter((a) => !a.startsWith('--'));
if (args.includes('--staged')) paths = git('diff --cached --name-only');
const d = args.indexOf('--diff');
if (d >= 0) paths = [...new Set([...git(`diff --name-only ${args[d + 1]}...HEAD`), ...git('diff --name-only'), ...git('diff --cached --name-only')])];
const out = sliceText(slice(load(), paths));
if (out) console.log(out);
