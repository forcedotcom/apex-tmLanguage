public interface InterfaceOne {
    void methodOne();
}

public interface InterfaceTwo {
    void methodTwo();
}

public interface InterfaceThree {
    void methodThree();
}

public with sharing class SafeNavigator implements InterfaceOne, InterfaceTwo, InterfaceThree {
    private Map<String, Plant> collection;
    Decimal j = .234;

    // Enums are considered static, so the safe nav operator can't be used
    public enum PlantTypes {
        SUCCULENT, FUR, UNKNOWN
    }

    public class Class {
        public String myInnerProperty = 'oh yeh';
    }

    class X {
        class Y { }
    }

    public void methodOne() {
        // Implementation
    }

    public void methodTwo() {
        // Implementation
    }

    public void methodThree() {
        // Implementation
    }
}

public class Plant {
    public String name;
}

