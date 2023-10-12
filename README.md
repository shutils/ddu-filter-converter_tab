# ddu-filter-converter_tab

Converter for ddu.vim

This converter converts the display of items in ddu-source-tab based on the tab's first window.
If terminal is running with the :terminal command, the command will be displayed.
Otherwise, display the current working directory.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddu.vim

https://github.com/Shougo/ddu.vim

### ddu-source-tab

https://github.com/kamecha/ddu-source-tab

## Configuration

```vim
call ddu#custom#patch_global(#{
    \   sourceOptions: #{
    \     tab: #{
    \       converters: ["converter_tab"],
    \     },
    \   }
    \ })
```
