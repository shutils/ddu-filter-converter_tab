import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.4.4/types.ts";
import { basename } from "https://deno.land/std@0.196.0/path/mod.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v3.4.4/deps.ts";
import { FilterArguments } from "https://deno.land/x/ddu_vim@v3.4.4/base/filter.ts";

type FilterParams = Record<never, never>;

type TabAction = {
  tabnr: number;
};

type Window = number[];

type TabInfo = {
  windows: Window[];
}[];

async function getBufName(denops: Denops, tabNr: number): Promise<string> {
  const tabInfo = await fn.gettabinfo(denops, tabNr);
  const bufNr = await fn.winbufnr(denops, (tabInfo as TabInfo)[0].windows[0]);
  const bufName = await fn.bufname(denops, bufNr);
  if (bufName) {
    return bufName;
  }
  return "";
}

async function getCwd(denops: Denops, tabNr: number): Promise<string> {
  const cwd = await fn.getcwd(denops, 0, tabNr);
  if (cwd) {
    return basename(cwd);
  }
  return "";
}

function isTerminal(bufName: string): boolean {
  return bufName.startsWith("term://");
}

function onlyCmd(bufName: string): string {
  if (bufName.startsWith("term://")) {
    const startIndex = bufName.lastIndexOf("//") + 2;
    return "term:" + bufName.substring(startIndex);
  }
  return bufName;
}

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items, denops }: FilterArguments<FilterParams>,
  ): Promise<DduItem[]> {
    return Promise.all(items.map(async (item: DduItem) => {
      if (!item.action) {
        return item;
      }
      const action = item.action as TabAction;
      const bufName = await getBufName(denops, action.tabnr);
      if (isTerminal(bufName)) {
        item.display = onlyCmd(bufName);
      } else {
        item.display = await getCwd(denops, action.tabnr);
      }
      return item;
    }));
  }
  params(): FilterParams {
    return {};
  }
}
