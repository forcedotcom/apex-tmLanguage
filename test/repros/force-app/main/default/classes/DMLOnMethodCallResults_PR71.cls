/**
 * PR #71: DML operations on method call results
 * 
 * This class demonstrates DML operations performed on method call results.
 * The syntax highlighting should recognize DML keywords when followed by method calls.
 */
public class DMLOnMethodCallResults_PR71 {
    
    public void dmlOnMapValues() {
        // Issue #26: DML on Map.values() receives same scope as direct insert
        Map<Id, Account> accounts = new Map<Id, Account>();
        insert accounts.values();
        insert new List<Account>();
    }
    
    public void dmlOnQueryResults() {
        List<Account> accounts = [SELECT Id FROM Account];
        update accounts;
        delete [SELECT Id FROM Contact];
    }
    
    public void dmlOnMethodReturn() {
        List<Account> accounts = getAccounts();
        upsert accounts;
        undelete getDeletedAccounts();
    }
    
    public void dmlOnChainedMethods() {
        insert getAccounts().clone();
        update new Map<Id, Account>(getAccounts());
    }
    
    private List<Account> getAccounts() {
        return new List<Account>();
    }
    
    private List<Account> getDeletedAccounts() {
        return new List<Account>();
    }
}

