/**
 * Multiline string literal support (Apex language feature).
 * Exercises multiline strings with template expressions.
 */
public class MultiLineString {
    String s = '''
    I am a multi ${var1}
    line ${var2}
    string ${var3}''';

    String t =
    '''
    I am a multi ${var1}
    line ${var2}
    string ${var3}
    ''';

    String u = 'a' +
    '''
    b
    '''
    + 'c';

    String templated = s.template(new Map<String, Object> {
        'var1' => 'foo',
        'var2' => 42,
        'var3' => true
    });
}
