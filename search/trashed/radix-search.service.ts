import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadixSearchService {

  constructor() { }

  private static diffPos(str1, str2: string): number {
    const limit = Math.min(str1.length, str2.length);
    for (let i = 0; i < limit; ++i) {
      if (str1[i] === str2[i]) {
        continue;
      }

      return i;
    }

    return limit;
  }

  generate(items: itemData[]): RadixSearch {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
    const alphabet = new Map<string, itemData[]>();
    ALPHABET.split('').forEach(char => alphabet.set(char, []));

    // distribute
    for (const item of items) {
      const char = item.title[0];
      alphabet[char] = item;
    }

    let root: Node = new Node();

    // identify minimum coherent identifiers
    for (const [_, localItems] of alphabet) {
      if (localItems.length === 0) {
        continue;
      }

      let min: string = localItems[0].title;
      for (let i = 1; i < localItems.length && min.length > 1; ++i) {
        const branchingOff = RadixSearchService.diffPos(min, localItems[i].title);
        min = min.slice(0, branchingOff);
      }

      this.populate(root, min, localItems);
    }

    this.populate(node);
    return null;
  }

  populate(node: Node, prefix: string, items: itemData[]): void {
    node.entries = items.map(item => item.ref);
    node.tmp = items;
  }
}

export interface Node {
  tmp: itemData[];
  entries: any[];
  children: Map<string, Node>;
}

export interface RadixSearch {
  search(query: string): any[];
}

export interface itemData {
  title: string;
  ref: any;
}
