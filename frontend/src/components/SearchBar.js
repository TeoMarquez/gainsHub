import { RiSearchLine } from '@remixicon/react';

export function SearchBar() {
  return (
    <div className="search-bar">
      <RiSearchLine className="search-icon" />
      <input type="text" placeholder="Search..." />
    </div>
  );
}
