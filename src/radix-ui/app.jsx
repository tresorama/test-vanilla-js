import PopoverDemo from "./components/popover-demo";
import AccordionDemo from "./components/accordion-demo";
import CollapsibleDemo from "./components/collapsible-demo";
import DialogDemo from "./components/dialog-demo";

/**
 * @param {{
 *   children: React.ReactNode,
 *   title: string,
 *   titleUrl?: string,
 * }} props
 */
const Section = ({ children, title, titleUrl }) => (
  <div className="px-8 flex flex-col gap-4 items-start">
    <h2 className="text-2xl">
      {titleUrl && <a href={titleUrl} className="underline" target="_blank">{title}</a>}
      {!titleUrl && title}
    </h2>
    {children}
  </div>
);


export const App = () => (
  <div className="py-12 space-y-12">
    <div className="px-8">
      <h1>Radix Demos</h1>
    </div>
    <div className="space-y-12">
      <Section title="Dialog" titleUrl="https://www.radix-ui.com/primitives/docs/components/dialog">
        <DialogDemo />
      </Section>
      <Section title="Collapsible" titleUrl="https://www.radix-ui.com/primitives/docs/components/collapsible">
        <CollapsibleDemo />
      </Section>
      <Section title="Accordion">
        <AccordionDemo />
      </Section>
      <Section title="Popover">
        <PopoverDemo />
      </Section>
    </div>
  </div>
);
