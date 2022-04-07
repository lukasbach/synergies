import { createAtom, createSynergy, SynergyProvider } from "synergies";
import { Button, Checkbox, ControlGroup, InputGroup } from "@blueprintjs/core";
import React from "react";
import { StorybookMiddlewareProvider } from "synergies-storybook-middleware";

// Atom name is optional and for debugging through middleware
const filterAtom = createAtom(false, "filter");
const itemsAtom = createAtom<Array<{ todo: string; checked: boolean }>>(
  [
    { todo: "First Todo", checked: true },
    { todo: "Second Todo", checked: false },
    { todo: "Third Todo", checked: false },
  ],
  "items"
);
const inputValueAtom = createAtom("", "input");

const useFilteredItems = createSynergy(itemsAtom, filterAtom).createSelector(
  (items, filter) => items.filter(({ checked }) => !filter || checked)
);

const useAddTodo = createSynergy(itemsAtom, inputValueAtom).createAction(
  () => (items, input) => {
    items.current.push({ todo: input.current, checked: false });
    input.current = "";
  }
);

const useToggleTodo = itemsAtom.createAction((id: number) => items => {
  items.current[id].checked = !items.current[id].checked;
});

const useToggleFilter = filterAtom.createAction(() => filter => {
  filter.current = !filter.current;
});

const List = () => {
  const items = useFilteredItems();
  const toggle = useToggleTodo();

  return (
    <>
      {items.map((item, index) => (
        <Checkbox
          key={index}
          checked={item.checked}
          label={item.todo}
          onChange={() => toggle(index)}
        />
      ))}
    </>
  );
};

const TodoInput = () => {
  const [value] = inputValueAtom.useValue();
  const setValue = inputValueAtom.useSet();
  const addTodo = useAddTodo();

  return (
    <ControlGroup>
      <InputGroup
        placeholder="Add a todo"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button onClick={addTodo}>Add</Button>
    </ControlGroup>
  );
};

const FilterButton = () => {
  const toggle = useToggleFilter();
  const [isToggled] = filterAtom.useValue();
  return (
    <Button onClick={toggle} active={isToggled}>
      Only show completed todos
    </Button>
  );
};

export const Example = () => (
  // We don't have to nest the providers so extremely, but this demonstrates how you can inject
  // atoms at any place in the hierarchy and they can still communicate upwards with other
  // atoms.
  <StorybookMiddlewareProvider>
    <SynergyProvider atoms={[filterAtom]}>
      <FilterButton />
      <SynergyProvider atoms={[itemsAtom]}>
        <List />
        <SynergyProvider atoms={[inputValueAtom]}>
          <TodoInput />
        </SynergyProvider>
      </SynergyProvider>
    </SynergyProvider>
  </StorybookMiddlewareProvider>
);

export default {
  title: "Todo List",
};
