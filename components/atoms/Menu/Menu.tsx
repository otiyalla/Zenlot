import React, { useState, useMemo } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { HStack, Menu as GSMenu, MenuItem, MenuItemLabel, Pressable } from '@/components/design-system/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { ViewStyle } from 'react-native';
import type { Selection } from '@react-types/shared';

interface menuOptionProps {
    label: string
    key: string
    icon?: React.ReactNode
    onPress?: (ele?: any) => void
}

export type MenuProps = {
    menuOptions: menuOptionProps[];
    menuPlacement?: "bottom" | "top" | "right" | "left" | "top left" | "top right" | "bottom" | "left" | "bottom right" | "right top" | "right bottom" | "left top" | "left bottom";
    menuStyle?: ViewStyle
    menuOpenNode?: React.ReactNode
    selectionMode?: "single" | "multiple" | "none"
    selectedOption?: Set<string>
    onMenuSelection?: (key: string) => void
    onMenuSelections?: (key: string[]) => void
    //trade: TradeEntryState;
    //onPress?: (trade: TradeEntryState) => void;
};

export const Menu: React.FC<MenuProps> = ({
    menuOptions,
    menuPlacement = "bottom right",
    menuOpenNode,
    menuStyle,
    selectionMode = 'single',
    selectedOption,
    onMenuSelection,
    onMenuSelections
}) => {
    const colorSchema = useColorScheme();
    const theme = Colors[colorSchema ?? 'light'];
    const { localize } = useTranslate();
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleMenuSelection = (key: Selection) => {
        console.log('selection: ', Array.from(key))
        const selections = Array.from(key) as string[];
        if (onMenuSelection) onMenuSelection(selections[0]);
        if (onMenuSelections) onMenuSelections(selections);
    }

    const menuItems = menuOptions.map((item, index: number) => (
        <MenuItem
            closeOnSelect
            key={`${item.label}`}
            onPress={() => {
                if (item.onPress) item.onPress();
                setOpen(false);
            }}
            textValue={`${localize(item.label)}`}
        >
            <MenuItemLabel size='sm' className="flex-row items-center">
                <HStack space='md' className="items-center">
                    {item.icon && item.icon}
                    <Text size='sm'>{localize(item.label)}</Text>
                </HStack>
            </MenuItemLabel>
        </MenuItem>
    ));

    const renderItem = ({ item }: { item: menuOptionProps }) => (
        <MenuItem
        key={item.key}
        closeOnSelect
        onPress={() => {
            item.onPress?.();
            setOpen(false);
        }}
        textValue={localize(item.label)}
        className="border-b border-outline-200 hover:bg-background-50 active:bg-background-100"
        >
            <MenuItemLabel size="sm" className="flex-row items-center">
                <HStack space="md" className="items-center">
                {item.icon}
                <Text size="sm">{localize(item.label)}</Text>
                </HStack>
            </MenuItemLabel>
        </MenuItem>
    );

    const handleMenuOpen = () => {
        setOpen((prev) => !prev);
    };

    const defaultMenuOpenButton =
        menuOpenNode ? menuOpenNode : <Icon name="ellipsis-vertical" size={16} color={theme.text} />;


    const staticItems = useMemo(
        () => menuOptions.map((item) => renderItem({ item })),
        [menuOptions]
    );


    return (
        <GSMenu
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            placement={menuPlacement}
            selectionMode={selectionMode}
            onSelectionChange={handleMenuSelection}
            selectedKeys={selectedOption}
            offset={5}
            style={menuStyle}
            trigger={({ ...triggerProps }) => (
                <Pressable
                    {...triggerProps}
                    onPress={handleMenuOpen}
                    className="px-1 py-1"
                >
                    {defaultMenuOpenButton}
                </Pressable>
            )}
        >
            {staticItems}
        </GSMenu>
    );
};
