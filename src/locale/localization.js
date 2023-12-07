import React from 'react';
import {EN} from './EN';
import {NL} from './NL';
export const langs = (locale) => {
    return locale == "EN" ? EN : NL;
}