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


const Selection = ({ description, options, onValueChange }: { 
    description: string, 
    options: {label: string, value: string, isDisabled?: boolean}[], 
    onValueChange: (value: string)=> any 
}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const Items = options.map((option) => (
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
      <Select testID='selection-wrapper' className= 'bg-secondary-50' onValueChange={handleChange} isFocused={isOpen} onOpen={handleOpen} onClose={handleClose} >
        <SelectTrigger testID='selection-trigger' variant='outline' size='md' className='flex-row items-center justify-between'>
          <SelectInput id='selection-input' testID='selection-input' style={{
            height: 40, 
          }} className='bg-color-secondary-0' placeholder={description} />
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