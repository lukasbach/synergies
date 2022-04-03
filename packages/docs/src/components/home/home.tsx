import * as React from "react";
import { useHideBars } from "./use-hide-bars";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./home.module.css";
import clsx from "clsx";
import { Code } from "./code";
import Link from "@docusaurus/Link";
import VisAppComponents from "../../../static/img/vis-app-components.svg";
import Logo from "../../../static/img/logo.svg";

// TODO mention performance

const introCode = `
const valueAtom = createAtom("Initial Value");
const todosAtom = createAtom([]);

const useAddTodo = createSynergy(valueAtom, todosAtom)
  .createAction(() => (value, todos) => {
    todos.current.push(value.current);
    value.current = "";
  });
`.trim();

const providersCode = `
<SynergyProvider atoms={[todosAtom]}>
  <SynergyProvider atoms={[tickedTodosAtom, starredTodosAtom]}>
    <TodoList />
  </SynergyProvider>

  <SynergyProvider atoms={[valueAtom]}>
    {/* Can access both valueAtom and todosAtom */}
    <TodoInput />
  </SynergyProvider>
</SynergyProvider>
`.trim();

const reusableAtomsCode = `
<SynergyProvider atoms={[authAtom, userDataAtom]}>
  <SynergyProvider atoms={[selectedItemAtom, isExpandedAtom]}>
    <Menu name="File" />
  </SynergyProvider>

  <SynergyProvider atoms={[selectedItemAtom, isExpandedAtom]}>
    <Menu name="Edit" />
  </SynergyProvider>
</SynergyProvider>
`.trim();

const selectorCode = `
const useTickedTodos = createSynergy(todosAtom, tickedTodosAtom)
  .createSelector(
    (todos, tickedTodos) =>
      todos.filter(todo => tickedTodos.includes(todo))
  );
  
const useAllTodos = todosAtom.useValue;
`.trim();

const readingAndWritingCode = `
const useTickTodo = createSynergy(todosAtom, tickedTodosAtom)
  .createAction(index => (todos, tickedTodos) => {
    tickedTodos.current.push(todos[index]);
  });
const useTickedTodos = createSynergy(todosAtom, tickedTodosAtom)
  .createSelector(
    (todos, tickedTodos) =>
      todos.filter(todo => tickedTodos.includes(todo))
  );
const useAllTodos = todosAtom.useValue;
`.trim();

const asyncCode = `
const useFetchData = 
  createSynergy(dataAtom, isLoadingAtom)
    .createAction(() => async (data, isLoading) => {
      isLoading.current = true;
      
      // Trigger rerenders of all components 
      // reading from \`isLoadingAtom\`.
      isLoading = isLoading.trigger();
      
      const res = await fetch(url);
      
      data.current = await res.json();
      isLoading.current = false;
    }
  );
`.trim();

const optimizedRerenderCode = `
const useDropItem = 
  createSynergy(selectedItemAtom, targetAtom)
    .createAction(() => async (selectedItem, target) => {
      // target atom was updated and will rerender
      // selectedItemAtom was only read from and will not
      target.current = selectedItem.current;
    }
  );
`.trim();

const Red: React.FC = ({ children }) => (
  <span className={styles.red}>{children}</span>
);
const Yellow: React.FC = ({ children }) => (
  <span className={styles.yellow}>{children}</span>
);
const Purple: React.FC = ({ children }) => (
  <span className={styles.purple}>{children}</span>
);
const Green: React.FC = ({ children }) => (
  <span className={styles.green}>{children}</span>
);
const Blue: React.FC = ({ children }) => (
  <span className={styles.blue}>{children}</span>
);
const Orange: React.FC = ({ children }) => (
  <span className={styles.orange}>{children}</span>
);

const Ctas = () => (
  <div className={clsx(styles.highlight)}>
    <Link to="/docs/getstarted" className={clsx(styles.primaryCta)}>
      Get Started
    </Link>
    <Link to="/docs/api" className={clsx(styles.primaryCta)}>
      Documentation
    </Link>
  </div>
);

export const Home: React.FC<{}> = props => {
  const { siteConfig } = useDocusaurusContext();
  console.log(siteConfig);
  useHideBars();
  return (
    <Layout
      title="Synergies"
      description="Use Global State. Reuse Local State."
    >
      <div className={styles.container}>
        <div className={clsx(styles.title, styles.blue, styles.header)}>
          <Logo />
          Synergies
        </div>
        <div className={styles.menu}>
          <Link to="/docs/getstarted" className={styles.menuItem}>
            Docs
          </Link>
          <Link to="/docs/api" className={styles.menuItem}>
            API
          </Link>
          <Link
            to="https://github.com/lukasbach/synergies"
            className={styles.menuItem}
          >
            GitHub
          </Link>
        </div>

        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title)}>
            Create a{" "}
            <span className={styles.yellow}>
              performant distributed context state
            </span>{" "}
            by <span className={styles.red}>synergizing</span> atomar context
            pieces and{" "}
            <span className={styles.green}>composing reusable state logic</span>
            .
          </div>
          <div className={clsx()}>
            <Code code={introCode} />
          </div>
        </div>

        <Ctas />

        <div className={clsx(styles.sides, styles.sidesInverted)}>
          <div className={clsx(styles.title)}>
            An <span className={styles.green}>application state</span> that
            follows the{" "}
            <span className={styles.purple}>hierarchical structure</span> of
            your components.
          </div>
          <VisAppComponents style={{ minWidth: "800px" }} />
        </div>

        <div className={clsx(styles.highlight, styles.statement, styles.right)}>
          First there was <Red>Flux</Red>. Than there was{" "}
          <Purple>Context</Purple>. Now there is <Green>Synergies</Green>.
        </div>

        <p className={clsx(styles.text)}>
          In the past, Flux-like libraries were the goto for state management.
          With React{"'"}s revamp of context, storing localized reusable state
          in custom context providers became more common. You don{"'"}t need to
          define the complete state in one place, you can reuse pieces of state,
          and compose them however you want. But there remain issues...
        </p>

        <div className={clsx(styles.highlight, styles.statement, styles.left)}>
          Lots of <Yellow>boilerplate</Yellow>. Nontrivial{" "}
          <Red>performance</Red> optimization. Messy data{" "}
          <Purple>exchange between contexts</Purple>.
        </div>

        <p className={clsx(styles.text)}>
          Synergies{" "}
          <b>
            <Green>solves those issues</Green>
          </b>{" "}
          by streamlining the way how global and local context-based state is
          defined and managed, provides clear and concise logic for deciding
          which component should rerender and which should not, and makes
          exchange between substates super easy!
        </p>

        <div
          className={clsx(
            styles.highlight,
            styles.statement,
            styles.marginTopBig
          )}
        >
          So how does it <Green>work</Green>?
        </div>

        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title)}>
            Create hooks for <span className={styles.purple}>reading</span> and{" "}
            <span className={styles.green}>writing</span> synergies of atoms.
          </div>
          <div className={clsx()}>
            <Code code={readingAndWritingCode} />
          </div>
        </div>

        <div
          className={clsx(styles.marginTop, styles.sides, styles.sidesInverted)}
        >
          <div className={clsx(styles.title)}>
            <span className={styles.yellow}>Nest</span> state providers
            arbitrarily. Synergies can access all atoms{" "}
            <span className={styles.red}>upwards the component hierarchy</span>.
          </div>
          <div className={clsx()}>
            <Code code={providersCode} />
          </div>
        </div>

        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title)}>
            Use <span className={styles.red}>Global State</span>. Reuse{" "}
            <span className={styles.green}>Local State</span>.
          </div>
          <div className={clsx()}>
            <Code code={reusableAtomsCode} />
          </div>
        </div>

        <p className={clsx(styles.text, styles.marginTop)}>
          You can synergyze atoms even if they are supplied by different
          providers, as long as they are in one path in the component hierarchy.
          Define localized state in a reusable component and have it interact
          with more globalized state further up in the hierarchy.
        </p>

        <div
          className={clsx(
            styles.highlight,
            styles.statement,
            styles.marginTopBig,
            styles.left
          )}
        >
          Avoid <Purple>unnecessary rerenders</Purple>.
        </div>

        <div className={clsx(styles.text, styles.marginTop)}>
          When accessing atom state, you do so by defining synergies of atoms
          and then specify selectors or actions on them. If you use a selector
          in a component, the component will rerender once one of the atoms
          updated from which it reads. However, when you define an action on a
          synergy of atoms, some of which are read from and only some are
          written to, dispatching the action will only update the atoms that
          actually are written to.
        </div>

        <div className={clsx(styles.marginTop, styles.highlight)}>
          <Code code={optimizedRerenderCode} />
        </div>

        <div
          className={clsx(
            styles.highlight,
            styles.statement,
            styles.right,
            styles.marginTopBig
          )}
        >
          <span className={styles.red}>Hunks?</span> No more!
        </div>

        <div
          className={clsx(styles.marginTop, styles.sides, styles.sidesInverted)}
        >
          <div className={clsx(styles.title)}>
            Write <span className={styles.red}>asynchronous update logic</span>{" "}
            and trigger rerenders on demand. Only components{" "}
            <Green>subscribing to the updated atoms</Green> will rerender.
          </div>
          <div className={clsx()}>
            <Code code={asyncCode} />
          </div>
        </div>

        <div
          className={clsx(
            styles.highlight,
            styles.statement,
            styles.left,
            styles.marginTopBig
          )}
        >
          <span className={styles.green}>Global State.</span>
          <br />
          <span className={styles.purple}>Local State.</span>
        </div>

        <p className={clsx(styles.text)}>
          You can provide your state atoms high up in your component hierarchy
          to provide global state data such as user information or
          authentication data. Or you can inject atoms in a provider within
          small reusable components to provide contextual state within a small
          localized component hierarchy.
        </p>

        <p className={clsx(styles.text)}>
          But most importantly, you can do both! Provide authentication data in
          a global synergy provider, and a list state in a localized provider
          within your list component for list items to consume. You can have
          many lists, each sharing the same atoms, but with their unique list
          state supplied by their respective provider. Also, you can define
          synergies that access both the localized list state and global
          authentication state.
        </p>

        <div
          className={clsx(
            styles.highlight,
            styles.statement,
            styles.left,
            styles.marginTopBig
          )}
        >
          Use for <Yellow>everything</Yellow>! Or <Red>some things</Red>.
        </div>

        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title, styles.green)}>3kB + immer</div>
          <p className={clsx(styles.text, styles.right)}>
            synergies uses immer for immutable data structures. Apart from that,
            only 3kB of gzipped code is added by using synergies.
          </p>
        </div>

        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title, styles.red)}>Typesafe</div>
          <p className={clsx(styles.text, styles.right)}>
            Complete typesafety is provided by Typescript declarations.
          </p>
        </div>

        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title, styles.purple)}>
            Supports Middlewares
          </div>
          <p className={clsx(styles.text, styles.right)}>
            Use the well-known concept of middlewares to track errors, log state
            changes or debug issues.
          </p>
        </div>

        <Ctas />
      </div>
    </Layout>
  );
};
