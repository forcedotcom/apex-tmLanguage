/**
 * PR #67: Support final keyword in method parameters
 * 
 * This class demonstrates methods with final keyword in parameters.
 * The syntax highlighting should properly recognize the final modifier.
 */
public class FinalKeywordInMethodParams_PR67 {
    
    public void methodWithFinalParameter(final String param) {
        System.debug(param);
    }
    
    public void methodWithMultipleFinalParams(final String str, final Integer num) {
        System.debug(str + num);
    }
    
    public void methodWithFinalAndRegular(final String finalParam, String regularParam) {
        System.debug(finalParam + regularParam);
    }
    
    public static void staticMethodWithFinal(final Boolean flag) {
        System.debug(flag);
    }
    
    /**
     * Test case: final keyword should not unhighlight the type that follows it.
     * Both types (with and without final) should have consistent syntax highlighting.
     * Issue: When final precedes a type, the type loses its keyword highlighting.
     */
    public void testFinalKeywordDoesNotUnhighlightType(final String str1, String str2) {
        // str1 parameter: final String - String should be highlighted as keyword
        // str2 parameter: String - String IS highlighted as keyword (correct)
        // Both String types should have identical highlighting
        System.debug(str1 + str2);
    }
    
    public void testMultipleTypesWithFinal(final Integer num, final Boolean flag, final Decimal dec) {
        // All three types (Integer, Boolean, Decimal) should be highlighted as keywords
        // even though they follow the final keyword
        System.debug(num + ' ' + flag + ' ' + dec);
    }
    
    public void contrastTest(String regularType, final String finalType) {
        // regularType: String is highlighted (correct)
        // finalType: String should also be highlighted (but currently isn't)
        // This demonstrates the highlighting inconsistency
        System.debug(regularType.equals(finalType));
    }
}

