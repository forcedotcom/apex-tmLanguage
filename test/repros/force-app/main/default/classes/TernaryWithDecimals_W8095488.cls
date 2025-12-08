/**
 * W-8095488: Ternary expression with decimals syntax highlighting
 * 
 * When a ternary expression contains a decimal literal and spaces are excluded,
 * the question mark may be incorrectly tokenized as a safe navigation operator
 * instead of a ternary operator.
 */
public class TernaryWithDecimals_W8095488 {
    
    // With spaces - should work correctly
    public void ternaryWithSpaces() {
        Boolean b = true;
        Decimal d = b ? .34 : 0;
        Decimal i = b?.123 : 0;
    }
    
    // Without spaces - potential tokenization issue
    public void ternaryWithoutSpaces() {
        Boolean b = true;
        Decimal d = b?.34:0;
        Decimal i = b?.123:0;
    }
    
    // Mixed scenarios
    public void mixedScenarios() {
        Boolean b = true;
        
        // Space before question mark, no space after
        Decimal d1 = b ?.34:0;
        
        // No space before, space after
        Decimal d2 = b? .34:0;
        
        // Space after question mark, no space around colon
        Decimal d3 = b? .34:0;
        
        // All spaces
        Decimal d4 = b ? .34 : 0;
        
        // Integer values (for comparison)
        Integer i1 = b?1:0;
        Integer i2 = b ? 1 : 0;
    }
    
    // Safe navigation operator (for comparison)
    public void safeNavigationOperator() {
        String s = 'test';
        Integer len = s?.length();
        
        Account acc;
        String name = acc?.Name;
    }
    
    // Complex expressions
    public void complexExpressions() {
        Boolean b = true;
        
        // Ternary in switch
        switch on (b) {
            when true {
                Decimal d = b?.34:0;
                String s = 'SUCCESS';
            }
        }
        
        // Nested ternary with decimals
        Decimal nested = b ? (b?.5:.25) : .0;
        
        // Ternary with decimal in variable declaration
        Decimal inline = b?.99:0;
    }
    
    // Property access vs ternary
    public void propertyVsTernary() {
        Boolean b = true;
        
        // These should be ternary operators, not safe navigation
        Decimal d = b?.34:0;
        Decimal i = b?.123:0;
        
        // This is safe navigation
        String type = this?.type;
    }
    
    String type = 'test';
}


