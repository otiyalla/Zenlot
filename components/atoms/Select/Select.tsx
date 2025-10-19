import {   
    Select as GSSeclect,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectScrollView,
    SelectItem,
    FormControl, } from '@/components/design-system/ui';
import { ChevronDownIcon, Icon } from '@/components/design-system/ui';
import React, { useState } from 'react';
import { useTranslate } from '@/hooks/useTranslate';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export interface SelectItemProps {
    label: string;
    value: string;
    isDisabled?: boolean;
}

export interface SelectProps {
    placeholder?: string;
    selectedValue?: string;
    options: SelectItemProps[];
    onValueChange: (value: string) => void;
    testID?: string;
    selectStyle?: any;
    inputStyle?: any;
    triggerStyle?: any;
    icon?: React.ReactElement<typeof Icon>;
    isFocused?: boolean;
    disable?: boolean;
    error?: boolean | string;
}

export const Select = ({ error, triggerStyle, testID, disable, selectStyle, placeholder, selectedValue, options, onValueChange }: SelectProps) => {
    const [selectedOption, setSelectedOption] = useState(selectedValue || '');
    const [isOpen, setIsOpen] = useState(false);
    const { localize } = useTranslate();
    const theme = useColorScheme() as 'light' | 'dark';

    const Items = options.map((option: SelectItemProps) => (
        <SelectItem
            key={option.value}
            label={localize(option.label)}
            value={option.value}
            isDisabled={option.isDisabled ?? disable}
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
      <FormControl isDisabled={disable} isInvalid={!!error}>
        <GSSeclect
          accessibilityLabel={placeholder}
          isInvalid={false}
          style={[
            { ...selectStyle }, 
            {
              backgroundColor: Colors[theme].inputBackground,
              color: Colors[theme].text,
              borderColor: Colors[theme].borderColor,
              marginTop: 5,
              marginBottom: 5,
            }]}
          selectedValue={selectedOption}
          testID='selection-wrapper'
          className='bg-secondary-50 rounded-lg'
          onValueChange={handleChange}
          isFocused={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          isDisabled={disable}
        >
          <SelectTrigger 
            accessibilityLabel={placeholder} 
            testID='selection-trigger' 
            variant='outline' 
            size='md' 
            className='flex-row items-center justify-between rounded-lg h-55'
            style={{
              ...triggerStyle,
              borderColor: error ? Colors[theme].error : Colors[theme].borderColor,
            }}
            >
            <SelectInput 
              accessibilityLabel={placeholder} 
              id='selection-input' 
              testID={testID} 
              style={{
                paddingVertical: 12,
                color: selectedOption ? Colors[theme].text : Colors[theme].placeholder,
              }} 
              placeholder={placeholder} 
            />
            <SelectIcon className='mr-3' as={ChevronDownIcon} />
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
        </GSSeclect>
      </FormControl>
    );

};

