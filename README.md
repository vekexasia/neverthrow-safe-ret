# neverthrow-safe-re
** Type-safe error handling with Go-style tuple returns for neverthrow **

This library extends [`neverthrow`](https://github.com/supermacro/neverthrow) to provide a **Go-inspired error-handling pattern** while maintaining strict type safety. If you’ve ever wanted to destructure a `Result` into a `[error, value]` tuple *without losing type information*, this is for you.

---

## **Features**

- **Go-style tuple returns**: Use `[err, value]` destructuring with type inference.
- **Zero dependencies**: Works alongside `neverthrow`, no bloat.
- **Monkey-patch integration**: Add `.safeRet()` directly to `Result` instances.
- **Type enforcement**: Forces error checks *at compile time* via `undefined` narrowing.
- **Seamless interop**: Works with existing `neverthrow` code.

---

## **Installation**

```bash  
npm install neverthrow-safe-ret  
```

---

## **Why?**

The original `neverthrow` issue [\#614](https://github.com/supermacro/neverthrow/issues/614) highlights the friction of chaining `.andThen()` for sequential operations. This library solves it by:

1. Letting you **exit early** on errors without callback hell.
2. **Inferring types** after checks (e.g., `value` becomes non-`undefined` post-error guard).

---

## **Usage**

### Basic Example

```typescript  
import { ok, err } from 'neverthrow';  
import 'neverthrow-safe-ret';  

const result = ok(42).safeRet();  
const [error, value] = result;  

if (error) {  
  // Handle error (type: Error | undefined)  
} else {  
  console.log(value); // Type: number  
}  
```


### Real-World Chain

```typescript  
import { Result, ok, err } from 'neverthrow';  
import 'neverthrow-safe-ret';  

declare function getUser(id: string): Result<User, Error>;  
declare function validate(user: User): Result<boolean, ValidationError>;  

function processUser(id: string): Result<boolean, Error | ValidationError> {  
  const [fetchErr, user] = getUser(id).safeRet();  
  if (fetchErr) return err(fetchErr);  

  const [validationErr, isValid] = validate(user).safeRet();  
  if (validationErr) return err(validationErr);  

  return ok(isValid);  
}  
```

---

## **How It Works**

The `.safeRet()` method returns a tuple where:

- **Error position**: `E` (undefined if `Ok`).
- **Value position**: `T` (undefined if `Err`).

**Type narrowing example**:

```typescript  
const [e, s] = ok("string").safeRet();
// e: undefined, s: string
const [e2, s2] = err("error").safeRet();
// e2: "error", s2: undefined

function a(x: Result<number, string>): Result<number, string> {
  const [e3, s3] = x.safeRet();
  // e3: string | undefined, s3: number | undefined
  // this forces you to check for e3
  if (typeof e3 !== "undefined") {
    // here we are sure that e3 is string and s3 is undefined
    return err(e3);
  }
  // s3 is now number
  return ok(s3);
}
```

---

## **Comparison**

| Approach | Code Style | Type Safety | Error Checks Enforced |
| :-- | :-- | :-- | :-- |
| Vanilla `neverthrow` | Method chaining | ✅ | ❌ (via `match`) |
| **`neverthrow-safe-ret`** | Imperative checks | ✅ | ✅ (via `undefined`) |

---

## **Caveats**

- **Monkey-patching**: Modifies `Result` prototypes. Avoid if your team dislikes patching.

---

## **Contributing**

PRs welcome!

---

**Credit**: Inspired by [neverthrow\#614](https://github.com/supermacro/neverthrow/issues/614).
**License**: MIT
