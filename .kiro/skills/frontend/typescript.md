# TypeScript Best Practices

## Type System

### Basic Types
```typescript
// Primitives
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let data: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Tuples
let tuple: [string, number] = ["John", 30];

// Any (avoid when possible)
let anything: any = "can be anything";

// Unknown (safer than any)
let value: unknown = "something";
if (typeof value === "string") {
    console.log(value.toUpperCase());
}
```

### Interfaces vs Types

```typescript
// Interface - use for object shapes, can be extended
interface User {
    id: number;
    name: string;
    email: string;
}

interface Admin extends User {
    role: "admin";
    permissions: string[];
}

// Type - use for unions, intersections, primitives
type ID = string | number;
type Status = "active" | "inactive" | "pending";

type UserWithStatus = User & {
    status: Status;
};
```

### Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
    return arg;
}

// Generic interface
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// Usage
const userResponse: ApiResponse<User> = {
    data: { id: 1, name: "John", email: "john@example.com" },
    status: 200,
    message: "Success"
};

// Generic constraints
interface HasId {
    id: number;
}

function getById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}
```

### Union and Intersection Types

```typescript
// Union - can be one of several types
type Result = Success | Error;

interface Success {
    type: "success";
    data: any;
}

interface Error {
    type: "error";
    message: string;
}

// Intersection - combines multiple types
type Employee = Person & Worker;

interface Person {
    name: string;
    age: number;
}

interface Worker {
    employeeId: string;
    department: string;
}
```

## Type Guards

```typescript
// typeof guard
function processValue(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}

// instanceof guard
class Dog {
    bark() { console.log("Woof!"); }
}

class Cat {
    meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

// Custom type guard
interface Fish {
    swim: () => void;
}

interface Bird {
    fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
    if (isFish(pet)) {
        pet.swim();
    } else {
        pet.fly();
    }
}
```

## Utility Types

```typescript
// Partial - makes all properties optional
interface User {
    id: number;
    name: string;
    email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Required - makes all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit - exclude specific properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; }

// Record - create object type with specific keys
type Roles = "admin" | "user" | "guest";
type Permissions = Record<Roles, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }

// ReturnType - extract return type of function
function getUser() {
    return { id: 1, name: "John" };
}
type UserType = ReturnType<typeof getUser>;
```

## Strict Mode

### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Null Safety

```typescript
// Use optional chaining
const userName = user?.profile?.name;

// Nullish coalescing
const displayName = userName ?? "Anonymous";

// Non-null assertion (use sparingly)
const element = document.getElementById("app")!;

// Better - check explicitly
const element = document.getElementById("app");
if (element) {
    element.textContent = "Hello";
}
```

## Function Types

```typescript
// Function type
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;

// Optional parameters
function greet(name: string, greeting?: string): string {
    return `${greeting ?? "Hello"}, ${name}`;
}

// Default parameters
function createUser(name: string, role: string = "user") {
    return { name, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
}

// Function overloads
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
    return typeof value === "string" ? value : value.toString();
}
```

## Enums

```typescript
// Numeric enum
enum Direction {
    Up,
    Down,
    Left,
    Right
}

// String enum (preferred)
enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING"
}

// Const enum (better performance)
const enum Color {
    Red = "#FF0000",
    Green = "#00FF00",
    Blue = "#0000FF"
}

// Better alternative - union of literals
type StatusType = "active" | "inactive" | "pending";
```

## Best Practices

1. **Enable strict mode** in tsconfig.json
2. **Avoid `any`** - use `unknown` if type is truly unknown
3. **Use interfaces for objects** that can be extended
4. **Use types for unions and intersections**
5. **Prefer `const` over `let`** when value won't change
6. **Use type guards** for narrowing types
7. **Leverage utility types** instead of manual type manipulation
8. **Use optional chaining** (?.) and nullish coalescing (??)
9. **Define return types** explicitly for public functions
10. **Use `readonly`** for immutable properties
11. **Prefer string literal unions** over enums
12. **Use generics** for reusable type-safe code

## Common Patterns

### Discriminated Unions
```typescript
type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; size: number }
    | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.size ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}
```

### Type Assertions
```typescript
// Use sparingly
const input = document.getElementById("input") as HTMLInputElement;

// Better - with type guard
const input = document.getElementById("input");
if (input instanceof HTMLInputElement) {
    input.value = "Hello";
}
```
