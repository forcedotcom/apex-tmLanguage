/**
 * PR #74/#75: Switch/when statement syntax highlighting and brace matching
 * 
 * This class demonstrates switch statements with when clauses.
 * Issue #2134: Switch/when statement syntax highlighting and brace matching.
 */
public class SwitchWhenBraceMatching_PR74_PR75 {
    
    /**
     * Test case matching issue #2134:
     * - Strings in when clause should be consistently syntax highlighted
     * - Bracket matching should match up pairs
     * - Brace matching issues when brace follows when clause
     */
    public void issue2134_switchWhenBraceMatching() {
        String param = 'test';
        switch on param {
            when 'A' {
                System.debug('when A');
            }
            when 'B' {
                System.debug('when B');
            }
            when 'C'
            {
                // Brace on new line after when clause
                System.debug('when C');
            }
            when 'D'{ 
                // Brace immediately after when clause without space
                System.debug('when D');
            }
            when else {
                System.debug('else');
            }
        }
    }
    
    public void simpleSwitchOnString() {
        String param = 'A';
        switch on (param) {
            when 'A' {
                System.debug('test');
            }
            when else {
                callExternalMethod();
            }
        }
    }
    
    public void switchWithMultipleStringValues() {
        String locale = 'de-CH';
        switch on locale {
            when 'de-CH' {
                System.debug('German Switzerland');
            }
            when 'fr-CH' {
                System.debug('French Switzerland');
            }
            when else {
                System.debug('Other locale');
            }
        }
    }
    
    public void switchOnInteger() {
        Integer i = 5;
        switch on i {
            when 2, 3, 4 {
                System.debug('when block 2 and 3 and 4');
            }
            when 7 {
                System.debug('when block 7');
            }
            when else {
                // @TODO.
            }
        }
    }
    
    public void switchOnSObject() {
        SObject sobject = new Account();
        switch on sobject {
            when Account a {
                System.debug('account ' + a);
            }
            when null {
                System.debug('null');
            }
            when else {
                System.debug('default');
            }
        }
    }
    
    public void switchOnMethodResult() {
        switch on someInteger(getValue()) {
            when 2, 3, 4 {
                System.debug('when block 2 and 3 and 4');
            }
            when 7 {
                System.debug('when block 7');
            }
            when else {
                // @TODO.
            }
        }
    }
    
    public void switchWithSafeNavigator() {
        MyClass obj = new MyClass();
        switch on (obj?.param) {
            when 'A' {
                System.debug('test');
            }
            when else {
                callExternalMethod();
            }
        }
    }
    
    private Integer someInteger(Integer val) {
        return val;
    }
    
    private Integer getValue() {
        return 5;
    }
    
    private void callExternalMethod() {
        System.debug('external');
    }
    
    private class MyClass {
        public String param;
    }
}

