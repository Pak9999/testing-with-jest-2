const stack = require('../src/stack');

test('peek on empty stack returns undefined', () => {
    expect(stack.peek()).toBeUndefined();
});

test('peek on stack with one element returns that element', () => {
    stack.push(1);
    expect(stack.peek()).toBeDefined();
    expect(stack.peek()).toBe(1);
});

test('peek on stack with two or more elements returns the top element', () => {
    stack.push(1);
    stack.push("wow");
    stack.push(42);
    expect(stack.peek()).toBeDefined();
    expect(stack.peek()).toBe(42);
});

// mitt test
test('pop on stack with elements returns and removes the top element', () => {
    // Lägger till två element i stacken
    stack.push('first');
    stack.push('second');
    
    // Kollar att pop returnerar det översta elementet
    const popped = stack.pop();
    expect(popped).toBe('second');  
    expect(stack.peek()).toBe('second'); // Medvetet fel värde för att göra att testet misslyckas
});
