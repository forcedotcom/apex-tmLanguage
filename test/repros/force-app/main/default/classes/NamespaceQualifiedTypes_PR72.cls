/**
 * PR #72: Support namespace-qualified types in extends/implements
 * 
 * This class demonstrates classes extending and implementing namespace-qualified types.
 * The syntax highlighting should properly parse System.Exception and Database.Batchable.
 */
public class NamespaceQualifiedTypes_PR72 extends System.Exception {
    // Class extends namespace-qualified type - issue #50
}

// Another example extending namespace-qualified type
public class MyCustomException_PR72 extends System.Exception {
    public MyCustomException_PR72(String message) {
        super(message);
    }
}

// Class implementing namespace-qualified type - issue #50
public class BatchableProcessor_PR72 implements Database.Batchable<Account> {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id FROM Account');
    }
    
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // Process accounts
        Integer foo = 0;
    }
    
    public void finish(Database.BatchableContext bc) {
        // Finish processing
    }
}

// Class extending and implementing namespace-qualified types
public class ComplexExample_PR72 extends System.OctopusException implements Database.Stateful {
    private Integer state;
    
    public ComplexExample_PR72(String message) {
        super(message);
    }
}

