import * as React from "react";
import { useHideBars } from "./use-hide-bars";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./home.module.css";
import clsx from "clsx";
import { Code } from "./code";
import Link from "@docusaurus/Link";
import VisAppComponents from "../../../static/img/vis-app-components.svg";

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
      todos.filter(todo => tickedTodos.current.includes(todo))
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
      todos.filter(todo => tickedTodos.current.includes(todo))
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

export const Home: React.FC<{}> = props => {
  const { siteConfig } = useDocusaurusContext();
  console.log(siteConfig);
  useHideBars();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div className={styles.container}>
        <div className={clsx(styles.title, styles.blue, styles.header)}>
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

        <div className={clsx(styles.highlight)}>
          <Link to="/docs/getstarted" className={clsx(styles.primaryCta)}>
            Get Started
          </Link>
          <Link to="/docs/getstarted" className={clsx(styles.primaryCta)}>
            Documentation
          </Link>
        </div>

        <div className={clsx(styles.sides, styles.sidesInverted)}>
          <div className={clsx(styles.title)}>
            Create an <span className={styles.green}>application state</span>{" "}
            that follows the{" "}
            <span className={styles.purple}>hierarchical structure</span> of
            your components.
          </div>
          <VisAppComponents style={{ minWidth: "800px" }} />
        </div>

        <div className={clsx(styles.highlight, styles.statement, styles.right)}>
          First there was <Red>Redux</Red>. Than there was{" "}
          <Purple>Context</Purple>. Now there is <Green>Synergies</Green>.
        </div>

        <p className={clsx(styles.text)}>
          In the past, Redux was the goto for state management. With React{"'"}s
          revamp of context, storing localized reusable state in custom context
          providers become more common. You don{"'"}t need to define the
          complete state in one place, you can reuse pieces of state, and
          compose them however you want. But there remain issues...
        </p>

        <div className={clsx(styles.highlight, styles.statement, styles.left)}>
          Lots of <Yellow>boilerplate</Yellow>. Nontrivial{" "}
          <Red>performance</Red> optimization. Messy data{" "}
          <Purple>exchange between contexts</Purple>.
        </div>

        <p className={clsx(styles.text)}>
          Synergies solves those issues by streamlining the way how global and
          local context-based state is defined and managed, provides an clear
          and concise logic for deciding which component should rerender and
          which should not, and makes exchange between substates super easy!
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

        <div className={clsx(styles.highlight, styles.statement, styles.right)}>
          <span className={styles.red}>Hunks?</span> No more!
        </div>

        <div
          className={clsx(styles.marginTop, styles.sides, styles.sidesInverted)}
        >
          <div className={clsx(styles.title)}>
            Write <span className={styles.red}>asynchronous update logic</span>{" "}
            and trigger rerenders on demand.{" "}
            <span className={styles.green}>
              Only components subscribing to the updated atoms will rerender.
            </span>
          </div>
          <div className={clsx()}>
            <Code code={asyncCode} />
          </div>
        </div>

        <div className={clsx(styles.text, styles.marginTop)}>
          But I must explain to you how all this mistaken idea of denouncing
          pleasure and praising pain was born and I will give you a complete
          account of the system, and expound the actual teachings of the great
          explorer of the truth, the{" "}
          <span className={styles.red}>asynchronous update logic</span> of human
          happiness. No one rejects, dislikes, or avoids pleasure itself,
          because it is pleasure, but because those who do not know how to
          pursue pleasure rationally encounter consequences that are extremely
          painful. Nor again is there anyone who loves or pursues or desires to
          obtain pain of itself, because it is pain, but because occasionally
          circumstances occur in which toil and pain can procure him some great
          pleasure. To take a trivial example, which of us ever undertakes
          laborious physical exercise, except to obtain some advantage from it?
          But who has any right to find fault with a man who chooses to enjoy a
          pleasure that has no annoying consequences, or one who avoids a pain
          that produces no resultant pleasure?
        </div>

        <div className={clsx(styles.marginTop, styles.highlight)}>
          <Code code={optimizedRerenderCode} />
        </div>

        <div className={clsx(styles.highlight, styles.statement, styles.left)}>
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
          state supplied by their respective provider.
        </p>

        <div className={clsx(styles.highlight, styles.statement, styles.left)}>
          Use for everything! Or some things.
        </div>
        <div className={clsx(styles.marginTop, styles.sides)}>
          <div className={clsx(styles.title)}>3kB + immer</div>
          <p className={clsx(styles.text)}>
            synergies uses immer for immutable data structures. Apart from that,
            only 3kB of gzipped code is added by using synergies. TODO
          </p>
        </div>
      </div>
    </Layout>
  );
};
