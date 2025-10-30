/**
 * PR #70: Ternary expression syntax highlighting
 * 
 * This class demonstrates nested ternary expressions and ternary with method calls.
 * The syntax highlighting should properly distinguish nested conditionals.
 */
public class TernaryExpressions_PR70 {
    
    public void simpleTernary() {
        Integer result = x ? 19 : 23;
    }
    
    public void nestedTernary() {
        // Nested ternary expression - issue #43
        Integer result = x ? y ? 1 : 2 : 3;
    }
    
    public void ternaryWithMethodCalls() {
        // Ternary with method call - issue #43
        String s = condition ? getValue() : getDefault();
    }
    
    public void ternaryAsArgument() {
        processValue(x ? 19 : 23);
    }
    
    public void complexNestedTernary() {
        String output = a ? (b ? 'both' : 'a only') : (c ? 'c only' : 'neither');
    }
    
    private String getValue() { return 'value'; }
    private String getDefault() { return 'default'; }
    private void processValue(Integer val) { }
    
    private Boolean x;
    private Boolean y;
    private Boolean a;
    private Boolean b;
    private Boolean c;
    private Boolean condition;
}

