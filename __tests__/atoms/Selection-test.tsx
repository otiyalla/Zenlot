import React from 'react';
import { render, fireEvent, screen, within, waitFor } from '@testing-library/react-native';
import Selection from '@/components/atoms/Selection';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', isDisabled: true },
];

const Wrapper = (children: React.ReactElement ) => (
  render (<GluestackUIProvider>
    {children}
  </GluestackUIProvider>)
);

describe('Selection', () => {
    it('renders with placeholder and options', () => {
        render(
            <Selection description="Select an option" options={options} onValueChange={jest.fn()} />
        );
        const placeholder = screen.toJSON().children[0].children[0].props.placeholder;
        expect(placeholder).toBe('Select an option');
        expect(placeholder).toBeTruthy();
        options.forEach(opt => {
            expect(screen.queryByText(opt.label)).toBeNull(); // Not visible until open
        });
    });
    
    it('opens the select and displays options', async () => {
        const onValueChange = jest.fn();

        const { getByTestId, findByText, queryByText } = Wrapper(
                <Selection
                description="Select an option"
                options={[
                    { label: 'One', value: '1' },
                    { label: 'Two', value: '2' },
                ]}
                onValueChange={onValueChange}
                />,
            );

        // Tap the trigger (synchronous)
        fireEvent.press(getByTestId('selection-trigger'));

        // Now WAIT for the portal content to appear
        const firstItem = await findByText('One');
        expect(firstItem).toBeTruthy();

        // Select an option
        fireEvent.press(firstItem);
        expect(onValueChange).toHaveBeenCalledWith('1');

        // List should close again
        await waitFor(() => {
            expect(queryByText('One')).toBeNull();
        });
    });
    /*
        it('opens the select and displays options', async () => {
            const { getAllByPlaceholderText } = Wrapper(
            <Selection description="Select an option" options={options} onValueChange={jest.fn()} />
            );
            //console.log("screen:", screen);
            //const selection = screen.toJSON().children[0].children[0];
            //const selection = screen.getByTestId('selection-input');
            //const wrapper = screen.getByTestId('selection-wrapper');
            const check = getAllByPlaceholderText('Select an option');
            console.log("check:", check);
            const select = screen.getByTestId('selection-input');
            fireEvent.press(select);
            console.log("wrapper:", select);
            const selection = select.getByPlaceholderText('Select an option');
            //const selection = within(wrapper).getByPlaceholderText('Select an option');
            console.log("selection:", selection);
            expect(selection.getByText('Option 1')).toBeTruthy();
            expect(selection.getByText('Option 2')).toBeTruthy();
            expect(selection.getByText('Option 3')).toBeTruthy();
        });

        
    /*
        it('calls onValueChange when an option is selected', () => {
            const onValueChange = jest.fn();
            Wrapper(
            <Selection description="Select an option" options={options} onValueChange={onValueChange} />
            );
            fireEvent.press(screen.getByPlaceholderText('Select an option'));
            fireEvent.press(screen.getByText('Option 2'));
            expect(onValueChange).toHaveBeenCalledWith('2');
        });

        it('does not call onValueChange for disabled option', () => {
            const onValueChange = jest.fn();
            Wrapper(
            <Selection description="Select an option" options={options} onValueChange={onValueChange} />
            );
            fireEvent.press(screen.getByPlaceholderText('Select an option'));
            fireEvent.press(screen.getByText('Option 3'));
            expect(onValueChange).not.toHaveBeenCalledWith('3');
        });
    */
  it('matches snapshot', () => {
    const { toJSON } = Wrapper(
      <Selection description="Select an option" options={options} onValueChange={jest.fn()} />
    );
    expect(toJSON()).toMatchSnapshot();
  });


});
