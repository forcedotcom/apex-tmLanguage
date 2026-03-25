#!/usr/bin/env bash
# Deploy apex/soql grammars to all Salesforce extensions in Cursor or VS Code.
set -e
for base in "$HOME/.cursor/extensions" "$HOME/.vscode/extensions"; do
  [ ! -d "$base" ] && continue
  # Base Apex (grammars/)
  for d in "$base"/salesforce.salesforcedx-vscode-apex-*; do
    [ -f "$d/grammars/apex.tmLanguage" ] && cp grammars/apex.tmLanguage grammars/soql.tmLanguage "$d/grammars/" && echo "→ $d/grammars"
  done 2>/dev/null
  # Apex language server
  for d in "$base"/salesforce.apex-language-server-extension-*; do
    [ -d "$d/grammars" ] && cp grammars/apex.tmLanguage grammars/soql.tmLanguage "$d/grammars/" && echo "→ $d/grammars"
  done 2>/dev/null
  # SOQL standalone
  for d in "$base"/salesforce.salesforcedx-vscode-soql-*; do
    [ -d "$d/grammars" ] && cp grammars/soql.tmLanguage "$d/grammars/" && echo "→ $d/grammars"
  done 2>/dev/null
done
