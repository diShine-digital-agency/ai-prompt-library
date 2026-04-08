#!/usr/bin/env bash
# ============================================================================
# deploy-wiki.sh — Push wiki pages to GitHub Wiki
# ============================================================================
#
# This script deploys the prepared wiki pages from _wiki-pages/ to the
# GitHub Wiki repository at:
#   https://github.com/diShine-digital-agency/ai-prompt-library.wiki.git
#
# Prerequisites:
#   - Git installed
#   - GitHub authentication configured (HTTPS with token or SSH key)
#   - The _wiki-pages/ directory exists with the generated wiki files
#
# Usage:
#   chmod +x deploy-wiki.sh
#   ./deploy-wiki.sh
#
# After successful deployment, you can safely delete:
#   - _wiki-pages/ directory
#   - This script (deploy-wiki.sh)
#
# ============================================================================

set -euo pipefail

REPO_URL="https://github.com/diShine-digital-agency/ai-prompt-library.wiki.git"
WIKI_PAGES_DIR="_wiki-pages"
TEMP_DIR=$(mktemp -d)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📚 AI Prompt Library — Wiki Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check that _wiki-pages/ exists
if [ ! -d "$WIKI_PAGES_DIR" ]; then
  echo -e "${RED}❌ Error: $WIKI_PAGES_DIR directory not found.${NC}"
  echo "   Make sure you run this script from the repository root."
  exit 1
fi

# Count files
FILE_COUNT=$(find "$WIKI_PAGES_DIR" -name '*.md' | wc -l)
echo -e "${YELLOW}📄 Found $FILE_COUNT wiki pages to deploy${NC}"
echo ""

# Clone the wiki repo (or initialize if it doesn't exist yet)
echo -e "${BLUE}📥 Cloning wiki repository...${NC}"
if git clone "$REPO_URL" "$TEMP_DIR" 2>/dev/null; then
  echo -e "${GREEN}   ✅ Wiki repository cloned${NC}"
else
  echo -e "${YELLOW}   ⚠️  Wiki repo doesn't exist yet or can't be cloned.${NC}"
  echo -e "${YELLOW}      Initializing a new wiki repository...${NC}"
  echo -e "${YELLOW}      NOTE: You may need to create the first wiki page manually${NC}"
  echo -e "${YELLOW}      via GitHub UI before this script can push.${NC}"
  cd "$TEMP_DIR"
  git init
  git remote add origin "$REPO_URL"
  cd - > /dev/null
fi

# Remove existing wiki content (clean deploy)
echo -e "${BLUE}🧹 Cleaning existing wiki content...${NC}"
find "$TEMP_DIR" -name '*.md' -not -path "$TEMP_DIR/.git/*" -delete 2>/dev/null || true

# Copy new wiki pages
echo -e "${BLUE}📋 Copying wiki pages...${NC}"
cp "$WIKI_PAGES_DIR"/*.md "$TEMP_DIR/"

# Commit and push
cd "$TEMP_DIR"
git config user.name "diShine Digital Agency"
git config user.email "kevin@dishine.it"
git add -A

if git diff --staged --quiet 2>/dev/null; then
  echo -e "${YELLOW}⚠️  No changes to deploy — wiki is already up to date.${NC}"
else
  git commit -m "Deploy wiki: $FILE_COUNT pages (EN/IT/FR) with sidebar and footer

Trilingual wiki with 33 content pages + sidebar + footer:
- 11 English pages
- 11 Italian pages  
- 11 French pages
- _Sidebar.md (trilingual navigation)
- _Footer.md (project info)

Deployed by deploy-wiki.sh"

  echo -e "${BLUE}🚀 Pushing to GitHub Wiki...${NC}"
  git push origin master 2>/dev/null || git push origin main 2>/dev/null || {
    echo -e "${YELLOW}   Trying to push to a new branch...${NC}"
    git push -u origin master 2>/dev/null || git push -u origin main
  }
  echo -e "${GREEN}   ✅ Wiki deployed successfully!${NC}"
fi

cd - > /dev/null

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}🎉 Done! Your wiki is live at:${NC}"
echo -e "${BLUE}   https://github.com/diShine-digital-agency/ai-prompt-library/wiki${NC}"
echo ""
echo -e "${YELLOW}📌 Next steps:${NC}"
echo "   1. Visit the wiki URL above to verify everything looks correct"
echo "   2. You can now safely delete the _wiki-pages/ directory and this script"
echo "   3. Commit those deletions to keep your repo clean"
echo ""
