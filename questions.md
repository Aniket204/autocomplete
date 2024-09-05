1. What is the difference between Component and PureComponent?
Give an example where it might break my app.
    -   A normal component is rerendered on every state and prop change. VS A pure component tries to reduce rerenders by comparing shallow comparison of state and prop changes.
    Using a pure component can break the app in the case when a prop is an object and only its child properties change. Since PureComponent uses shallow comparison, it may not detect the update, leading to inconsistent UI rendering.


2. Context + ShouldComponentUpdate might be dangerous. Why is
that?
    -   ShouldComponentUpdate is subscribed to prop and state updates only and not the provided context. Hence might cause an issue when trying to use both together.


3. Describe 3 ways to pass information from a component to its
PARENT.
    -   a) We can pass callback functions to the children which will send back the necessary info to the parent using that function
        b) We can set up a context using useContext wrap the module in a context.provider. All the elements inside this context will have the access to updated values. So if a child updates something the parent naturally will have its value.
        c) Using a global state management tool like redux. Similar to context this global state can be updated and subscribed from anywhere in the application. Hence any data changes in the child will be visible in the parent component.


4. Give 2 ways to prevent components from re-rendering.
    -   a) We can use React.memo to memoise the component. This will ensure the component rerenders only on prop changes. 
        b) Memoise variables and functions using usememo, usecallback.


5. What is a fragment and why do we need it? Give an example where it
might break my app.
    -   Fragment helps us wrapping multiple elements in one bundle without adding it in the dom. If we use a wrapper element thats an added node in the dom.
    It might cause some problems if the children elements depend on the parent for styling or inherit something from the immediate parent.

6. Give 3 examples of the HOC pattern.
    -   a) We can create a logger HOC, which logs props or any other important passed to the wrappedcomponent.
        b) Authenticator HOC, wrapped component will be shown only when a specifically privileged user is authenticated.
        c) Add custom styles, conditional rendering and similar stuff depending on a state.


7. What's the difference in handling exceptions in promises,
callbacks and async...await?
    -   In promises exceptions or errors can be handled using .catch method but with async await we have to specify try catch blocks explicitly. As theres no in built in error handling methods.


8. How many arguments does setState take and why is it async.
    -   First argument can be either a value or a function. These functions are often arrow function where you can refer to the previous state and make updates on it.
        Second is a optional callback that executes after state update.
    It’s async because React batches updates for performance reasons.


9. List the steps needed to migrate a Class to Function
Component.
    -   a) Convert the class in a function. 
        b) Change the state declarations, implement useStates.
        c) Get rid of all the lifecycle methods if there are any present. Use useeffect for all side effects.
        d) Remove this binding from all the states and use direct access instead. (this.state to just state)
        e) Handle props differently, we no more need to access props like this.props... Props are now sent as a single entity or a object in the same function we implemented in 'a'.


10. List a few ways styles can be used with components.
    -   a) Inline styles, specify styles in a javascript variable and assign that in the style attribute of any element.
        b) Using classes, we can maintain and import an external css with selectors. 
        c) Bootstrap classes
        d) Styles components


11. How to render an HTML string coming from the server.
    -   For sensitive info coming from server we can render that string using attribute 
    dangerouslySetInnerHTML={{ __html: htmlString }}.