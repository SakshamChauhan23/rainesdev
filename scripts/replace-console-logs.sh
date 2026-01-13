#!/bin/bash

# Script to replace console.log/error/warn with logger throughout the codebase
# This prevents sensitive data leaks in production

echo "🔍 Finding files with console statements..."

# Find all TypeScript/JavaScript files with console statements
FILES=$(grep -rl "console\.\(log\|error\|warn\|info\|debug\)" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null)

if [ -z "$FILES" ]; then
    echo "✅ No console statements found!"
    exit 0
fi

echo "📝 Found console statements in the following files:"
echo "$FILES" | wc -l | xargs echo "   Total files:"

echo ""
echo "🔧 Processing files..."

for file in $FILES; do
    # Skip if file already imports logger
    if grep -q "import.*logger.*from.*@/lib/logger" "$file" 2>/dev/null; then
        echo "   ⏭️  Skipping $file (already uses logger)"
        continue
    fi

    # Check if file has any console statements
    if ! grep -q "console\.\(log\|error\|warn\|info\|debug\)" "$file" 2>/dev/null; then
        continue
    fi

    echo "   📝 Processing $file"

    # Add logger import after the first import statement
    if [[ "$file" == *".ts"* ]] || [[ "$file" == *".tsx"* ]]; then
        # Check if file uses 'use client' or 'use server'
        if grep -q "^['\"]use \(client\|server\)['\"]" "$file" 2>/dev/null; then
            # Add import after 'use client'/'use server' directive
            sed -i '' "/^['\"]use \(client\|server\)['\"]$/a\\
import { logger } from '@/lib/logger'\\
" "$file"
        else
            # Add import at the beginning
            sed -i '' "1i\\
import { logger } from '@/lib/logger'\\
" "$file"
        fi

        # Replace console statements
        sed -i '' 's/console\.log/logger.info/g' "$file"
        sed -i '' 's/console\.error/logger.error/g' "$file"
        sed -i '' 's/console\.warn/logger.warn/g' "$file"
        sed -i '' 's/console\.info/logger.info/g' "$file"
        sed -i '' 's/console\.debug/logger.debug/g' "$file"
    fi
done

echo ""
echo "✅ Console statements replaced! Files modified:"
grep -rl "import.*logger.*from.*@/lib/logger" src/ --include="*.ts" --include="*.tsx" | wc -l | xargs echo "   "

echo ""
echo "🔍 Remaining console statements (if any):"
REMAINING=$(grep -rn "console\.\(log\|error\|warn\|info\|debug\)" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l)
echo "   $REMAINING instances"

if [ "$REMAINING" -gt 0 ]; then
    echo ""
    echo "   Files still containing console statements:"
    grep -rl "console\.\(log\|error\|warn\|info\|debug\)" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | head -20
fi

echo ""
echo "✅ Done!"
