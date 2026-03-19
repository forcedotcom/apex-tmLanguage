---
name: deploy-apex-grammar
description: Build apex-tmLanguage grammars and deploy them to all Salesforce extensions in the IDE. Use when deploying grammar changes, testing syntax highlighting, or when the user asks to deploy/copy grammars to the IDE.
---

# Deploy Apex Grammar to IDE

## Workflow

1. **Build**: Run `yarn install && yarn build` from the apex-tmLanguage project root.
2. **Deploy**: Run `bash .cursor/skills/deploy-apex-grammar/scripts/deploy.sh` from the project root.
3. **Reload**: Tell the user to reload the window (Command Palette → "Developer: Reload Window").

## Deploy targets

The script copies to all Salesforce extensions that use these grammars:

| Extension | Path | Files |
|-----------|------|-------|
| salesforcedx-vscode-apex | grammars/ | apex, soql |
| apex-language-server-extension | grammars/ | apex, soql |
| salesforcedx-vscode-soql | grammars/ | soql |

Searches both `~/.cursor/extensions/` and `~/.vscode/extensions/`.

## One-liner

```bash
yarn install && yarn build && bash .cursor/skills/deploy-apex-grammar/scripts/deploy.sh
```
