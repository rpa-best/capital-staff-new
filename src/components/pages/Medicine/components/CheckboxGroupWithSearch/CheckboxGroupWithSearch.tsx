import React, { useState } from "react";
import scss from "./CheckboxGroupWithSearch.module.scss";
import Input from "../../../../comps/Input/Input";

interface ICheckboxItem {
    id: string | number;
    label: string;
}

interface ICheckboxGroupWithSearch {
    title: string;
    items: ICheckboxItem[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    searchPlaceholder?: string;
    required?: boolean;
}

const CheckboxGroupWithSearch = ({
    title,
    items,
    selectedIds,
    onToggle,
    searchPlaceholder = "Поиск...",
    required = false
}: ICheckboxGroupWithSearch) => {
    const [search, setSearch] = useState("");

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
    );

    const searchId = `search-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={scss.section}>
            <div className={scss.sectionTitle}>
                {title} {required && "*"}
            </div>
            <Input
                id={searchId}
                name={searchId}
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className={scss.checkboxGroup}>
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <label key={item.id} className={scss.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(String(item.id))}
                                onChange={() => onToggle(String(item.id))}
                            />
                            <span>{item.label}</span>
                        </label>
                    ))
                ) : (
                    <div className={scss.noResults}>Ничего не найдено</div>
                )}
            </div>
        </div>
    );
};

export default CheckboxGroupWithSearch;
