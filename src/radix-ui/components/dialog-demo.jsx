import * as Dialog from '@radix-ui/react-dialog';

export default () => (
  <Dialog.Root>

    <Dialog.Trigger>Open Dialog</Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content className='data-[state=open]:block fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog Description</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>

  </Dialog.Root>
);