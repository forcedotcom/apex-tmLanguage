/**
 * PR #68/#69: Annotation on same line as method declaration
 * 
 * This class demonstrates annotations on the same line as method declarations.
 * The syntax distinguishes annotations from method modifiers.
 */
public class AnnotationOnSameLine_PR68_PR69 {
    
    @Future(callout=true) public static void futureMethod() {
        System.debug('Future method');
    }
    
    @InvocableMethod(label='Test') public static void invocableMethod() {
        System.debug('Invocable method');
    }
    
    @TestVisible private void testVisibleMethod() {
        System.debug('Test visible method');
    }
    
    @deprecated public void deprecatedMethod() {
        System.debug('Deprecated method');
    }
}

