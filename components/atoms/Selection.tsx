import {   
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectScrollView,
    SelectItem, } from '../ui/select';
import { ChevronDownIcon, Icon } from '../ui/icon'
import React, { useState } from 'react';

interface ISelectItem {
    label: string;
    value: string;
    isDisabled?: boolean;
}

interface ISelection {
    description?: string;
    selectedValue?: string;
    options: ISelectItem[];
    onValueChange: (value: string) => void;
    testID?: string;
    selectStyle?: any;
    inputStyle?: any;
    triggerStyle?: any;
    icon?: React.ReactElement<typeof Icon>;
    isFocused?: boolean;
}

const Selection = ({ selectStyle, description, selectedValue, options, onValueChange }: ISelection) => {
    const [selectedOption, setSelectedOption] = useState(selectedValue || '');
    const [isOpen, setIsOpen] = useState(false);

    const Items = options.map((option: ISelectItem) => (
        <SelectItem
            key={option.value}
            label={option.label}
            value={option.value}
            isDisabled={option.isDisabled}
            //isHovered={option.value === selectedOption}
        />
    ));

    const handleChange = (value: string) => {
        setSelectedOption(value);
        onValueChange(value);
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
  
    return (
      <Select accessibilityLabel={description} isInvalid={false} style={{ ...selectStyle}} selectedValue={selectedOption} testID='selection-wrapper' className= 'bg-secondary-50 rounded-lg' onValueChange={handleChange} isFocused={isOpen} onOpen={handleOpen} onClose={handleClose} >
        <SelectTrigger accessibilityLabel={description} testID='selection-trigger' variant='outline' size='md' className='flex-row items-center justify-between rounded-lg  h-50'>
          <SelectInput 
            accessibilityLabel={description} 
            id='selection-input' 
            testID='selection-input' 
            style={{
              height: 40,
            }} 
            className='bg-color-secondary-0' 
            placeholder={description} 
          />
          <SelectIcon className='mr-3'  as={ChevronDownIcon} />
        </SelectTrigger> 
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectScrollView>
              {Items}
            </SelectScrollView>
            </SelectContent>
        </SelectPortal>
      </Select>
    );

};

export default Selection;