/** @jsx jsx */
/** @jsxFrag React.Fragment */

import log from 'electron-log';
import type React from 'react';
import { jsx } from '@emotion/core';

Object.assign(console, log);

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import { ItemClassConfiguration, RegisterItemDataHook, RegistryItemViewProps, RegistryViewProps } from '@riboseinc/paneron-registry-kit/types/views';
import { GenericRelatedItemView, PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';


interface AnimalData {
  name?: string
  bestFriendRef?: { classID: string, itemID: string }
}
type CatColor = ('blue' | 'sepia' | 'black' | 'white' | 'brown' | 'chocolate' | 'cinnamon')[]
interface CatData extends AnimalData {
  coat: 'tabby' | 'spotted tabby' | 'solid' | 'multicolor'
  primaryColor: CatColor
  secondaryColor?: CatColor
  breed?: 'siberian' | 'siamese'
}
interface DogData extends AnimalData {
  breed: 'husky' | 'bearded collie' | 'smooth dachshund' | 'st berdoodle'
}
interface SheepData extends AnimalData {
  woolColor: ('white' | 'orange' | 'magenta' | 'light blue' | 'yellow' | 'lime' | 'pink' | 'gray' | 'light gray' | 'cyan' | 'purple' | 'blue' | 'brown' | 'green' | 'red' | 'black')[]
  hairOnFace: 'none' | 'short' | 'long' | 'too long, can’t see'
}


const animal: Omit<ItemClassConfiguration<AnimalData>, 'meta' | 'defaults' | 'views' | 'sanitizePayload'> = {
  itemSorter: (p1, p2) => (p1.name || '').localeCompare(p2.name || ''),
  validatePayload: async () => true,
}


const BestFriendDetail: React.FC<{
  ref?: { classID: string, itemID: string }
  useRegisterItemData: RegisterItemDataHook
  getRelatedItemClassConfiguration: RegistryItemViewProps<any>["getRelatedItemClassConfiguration"]
}> = function ({ ref, useRegisterItemData, getRelatedItemClassConfiguration }) {
  return <PropertyDetailView title="Best friend">
    {ref
      ? <GenericRelatedItemView
          itemRef={ref}
          useRegisterItemData={useRegisterItemData}
          getRelatedItemClassConfiguration={getRelatedItemClassConfiguration} />
      : "None :("}
  </PropertyDetailView>;
}


const cat: ItemClassConfiguration<CatData> = {
  ...animal,
  meta: {
    title: "Cat",
    description: "Cat",
    id: 'cat',
    alternativeNames: [],
  },
  defaults: {},
  sanitizePayload: async (p) => p,
  views: {
    listItemView: ({ itemData, itemID }) => <span>{itemData.name || `unnamed cat ${itemID}`}</span>,
    detailView: ({ itemData, useRegisterItemData, getRelatedItemClassConfiguration }) => <div>
      <BestFriendDetail
        ref={itemData.bestFriendRef}
        useRegisterItemData={useRegisterItemData}
        getRelatedItemClassConfiguration={getRelatedItemClassConfiguration} />
      <PropertyDetailView title="Coat">
        {itemData.coat}
      </PropertyDetailView>
      <PropertyDetailView title="Primary color">
        {itemData.primaryColor}
      </PropertyDetailView>
      {itemData.secondaryColor
        ? <PropertyDetailView title="Secondary color">
            {itemData.secondaryColor}
          </PropertyDetailView>
        : null}
      <PropertyDetailView title="Breed">
        {itemData.breed || 'unknown'}
      </PropertyDetailView>
    </div>,
    editView: () => <p>Edit view sample TBD</p>
  },
};


const dog: ItemClassConfiguration<DogData> = {
  ...animal,
  meta: {
    title: "Dog",
    description: "Dog",
    id: 'dog',
    alternativeNames: [],
  },
  defaults: {},
  sanitizePayload: async (p) => p,
  views: {
    listItemView: ({ itemData, itemID }) => <span>{itemData.name || `unnamed cat ${itemID}`}</span>,
    detailView: ({ itemData, useRegisterItemData, getRelatedItemClassConfiguration }) => <div>
      <BestFriendDetail
        ref={itemData.bestFriendRef}
        useRegisterItemData={useRegisterItemData}
        getRelatedItemClassConfiguration={getRelatedItemClassConfiguration} />
      <PropertyDetailView title="Breed">
        {itemData.breed}
      </PropertyDetailView>
    </div>,
    editView: () => <p>Edit view sample TBD</p>
  },
};


const sheep: ItemClassConfiguration<SheepData> = {
  ...animal,
  meta: {
    title: "Sheep",
    description: "Sheep",
    id: 'sheep',
    alternativeNames: [],
  },
  defaults: {
    hairOnFace: 'short',
  },
  sanitizePayload: async (p) => p,
  views: {
    listItemView: ({ itemData, itemID }) => <span>{itemData.name || `unnamed cat ${itemID}`}</span>,
    detailView: ({ itemData, useRegisterItemData, getRelatedItemClassConfiguration }) => <div>
      <BestFriendDetail
        ref={itemData.bestFriendRef}
        useRegisterItemData={useRegisterItemData}
        getRelatedItemClassConfiguration={getRelatedItemClassConfiguration} />
      <PropertyDetailView title="Wool color">
        {itemData.woolColor}
      </PropertyDetailView>
      <PropertyDetailView title="Facial hair">
        {itemData.hairOnFace}
      </PropertyDetailView>
    </div>,
    editView: () => <p>Edit view sample TBD</p>
  },
};


const itemConfig: RegistryViewProps["itemClassConfiguration"] = {
  'cat': cat,
  'dog': dog,
  'sheep': sheep,
};


const subregisters = {
  homeDwellers: {
    title: "Home dwellers",
    itemClasses: ['cat', 'dog'],
  },
  farmDwellers: {
    title: "Farm dwellers",
    itemClasses: ['sheep', 'dog'],
  },
}


export default function () {
  return <RegistryView
    itemClassConfiguration={itemConfig}
    subregisters={subregisters}
  />
};
