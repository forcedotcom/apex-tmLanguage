/**
 * PR #73: Initializer block syntax highlighting
 * 
 * This class demonstrates initialization blocks in nested classes with method calls.
 * Issue #4920: Initializer block syntax highlighting should match method body highlighting.
 */
public class InitializerBlockSyntax_PR73 {
    
    public class NoneDAGException extends Exception {
        // Initializer - string literal should be consistently highlighted
        // Issue: String highlighting is broken in initializer blocks
        {
            this.setMessage('Object graph should be a Directed Acyclic Graph.');
            this.setMessage('Simple string');
            this.setMessage('String with "quotes" inside');
            System.debug('Debug message in initializer');
        }
        
        // Sample method for comparison - same strings highlighted correctly here
        public void anotherMethod() {
            this.setMessage('Object graph should be a Directed Acyclic Graph.');
            this.setMessage('Simple string');
            this.setMessage('String with "quotes" inside');
            System.debug('Debug message in method');
        }
    }
    
    public class ExampleWithInitializer {
        private String message;
        
        // Empty initializer
        {
        }
        
        // Initializer with multiple statements
        {
            Integer x = 5;
            String msg = 'test';
            message = msg;
            System.debug(message);
        }
    }
    
    public class StaticInitializerExample {
        private static Integer counter;
        
        // Note: Apex does NOT support static initialization blocks like Java
        // This tests grammar handling
        static {
            counter = 0;
        }
    }
    
    /**
     * Test case: String literals in initializer blocks should have consistent highlighting.
     * Issue: Strings in initializer blocks show inconsistent/incorrect highlighting
     * compared to the same strings in method bodies.
     */
    public class StringHighlightingInInitializer {
        private String message;
        
        // Initializer block with various string scenarios
        {
            // All these strings should be highlighted consistently
            message = 'Initializer string';
            message = 'String with keywords like Object and Graph';
            message = 'String with numbers 123 and symbols !@#';
            this.setMessage('Method call with string parameter');
            System.debug('Debug: initializer block string');
        }
        
        // Method body for comparison - same strings work correctly here
        public void compareMethod() {
            message = 'Initializer string';
            message = 'String with keywords like Object and Graph';
            message = 'String with numbers 123 and symbols !@#';
            this.setMessage('Method call with string parameter');
            System.debug('Debug: method body string');
        }
    }
}

