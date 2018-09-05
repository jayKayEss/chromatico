import React from 'react';
import classNames from 'classnames';
import { IconButton } from '../util';

const MenuButton = props => (
    <div id="menu" className={classNames({ 'sidebar-active': props.sidebarActive })}>
        <IconButton icon="menu" size="small" onClick={props.onToggleSidebar} title="Show menu"/>
    </div>
);

export default MenuButton;