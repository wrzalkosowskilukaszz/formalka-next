// Interview notes, recordings, consents and contact lists never enter this repository, which is public
// (docs/solutions/2026-10-16-pushing-to-a-public-lab-repo.md; the Phase 1 options of 17.10.2026). This check fails on a
// tracked or staged file that looks like interview data: an audio or video file, or a file under a folder named for
// raw interview material. Templates belong in a folder with another name. It is a guard, not a proof: a note saved
// as research/x.md still passes, so the interview files stay outside the git working tree.
// Run: node tools/privacy/interview-data.mjs [--staged]   (the pre-commit hook runs it with --staged)
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const MEDIA = /\.(m4a|mp3|wav|ogg|oga|opus|aac|flac|wma|amr|3gp|aiff?|webm|mp4|m4v|mov|mkv|avi)$/i;
export const FOLDERS = /(^|\/)(interview-data|interviews-raw|interview-notes|participants|consents|consent-forms|recordings|transcripts|contact-lists|coding-sheets)(\/|$)/i;

export function offending(paths) {
  return paths.filter((p) => MEDIA.test(p) || FOLDERS.test(p.split('/').slice(0, -1).join('/')));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const staged = process.argv.includes('--staged');
  const out = execFileSync('git', staged ? ['diff', '--cached', '--name-only', '--diff-filter=ACMR'] : ['ls-files'], { encoding: 'utf8' });
  const bad = offending(out.split('\n').filter(Boolean));
  for (const p of bad) console.error(`interview data must not enter the repository: ${p}`);
  if (bad.length) { console.error('Keep interview files outside the git working tree (the repository is public).'); process.exit(1); }
  console.log(`interview-data: ${staged ? 'staged' : 'tracked'} files clean`);
}
