"use client";

import { ReactNode, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderCircle, ChevronLeft, ChevronRight } from "lucide-react";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  hideOnMobile?: boolean;
}

export interface TabConfig<T> {
  value: string;
  label: string;
  data: T[];
  columns: TableColumn<T>[];
  onToggleStatus?: (item: T) => void;
  statusAccessor?: keyof T;
  emptyMessage?: string;
}

interface TableTabsProps<T> {
  tabs: TabConfig<T>[];
  loading?: boolean;
  defaultTab?: string;
  itemsPerPage?: number;
  enablePagination?: boolean;
}

export function TableTabs<T extends { id: number | string }>({
  tabs,
  loading = false,
  defaultTab,
  itemsPerPage = 10,
  enablePagination = true,
}: TableTabsProps<T>) {
  // Estado de paginação para cada tab
  const [currentPages, setCurrentPages] = useState<Record<string, number>>(
    tabs.reduce((acc, tab) => ({ ...acc, [tab.value]: 1 }), {})
  );

  const handlePageChange = (tabValue: string, newPage: number) => {
    setCurrentPages((prev) => ({ ...prev, [tabValue]: newPage }));
  };

  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
      <TabsList className="flex flex-wrap w-full gap-1 sm:w-[400px]">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
            {tab.label} ({tab.data.length})
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => {
        const currentPage = currentPages[tab.value] || 1;
        const totalPages = enablePagination ? Math.ceil(tab.data.length / itemsPerPage) : 1;

        const startIndex = enablePagination ? (currentPage - 1) * itemsPerPage : 0;
        const endIndex = enablePagination ? startIndex + itemsPerPage : tab.data.length;
        const paginatedData = tab.data.slice(startIndex, endIndex);

        return (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 space-y-4">
            <div className="bg-card border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tab.columns.map((col, idx) => (
                      <TableHead
                        key={idx}
                        className={col.hideOnMobile ? "hidden sm:table-cell" : ""}
                      >
                        {col.header}
                      </TableHead>
                    ))}
                    {tab.statusAccessor && <TableHead className="text-center">Status</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={tab.columns.length + 1} className="text-center py-8">
                        <div className="w-full justify-center flex">
                          <LoaderCircle className="animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={tab.columns.length + 1}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {tab.emptyMessage || "Nenhum registro encontrado"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => {
                      const isInactive = tab.statusAccessor && !item[tab.statusAccessor];

                      return (
                        <TableRow key={item.id}>
                          {tab.columns.map((col, idx) => {
                            const value =
                              typeof col.accessor === "function"
                                ? col.accessor(item)
                                : item[col.accessor as keyof T];

                            return (
                              <TableCell
                                key={idx}
                                className={`${col.hideOnMobile ? "hidden sm:table-cell py-3" : "py-3"} ${
                                  isInactive ? "opacity-60" : ""
                                } ${col.className || ""}`}
                              >
                                {value as ReactNode}
                              </TableCell>
                            );
                          })}

                          {/* Switch de Status */}
                          {tab.statusAccessor && tab.onToggleStatus && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                {!isInactive && (
                                  <span className="text-sm text-muted-foreground">Ativo</span>
                                )}
                                <Switch
                                  checked={!!item[tab.statusAccessor]}
                                  onCheckedChange={() => tab.onToggleStatus?.(item)}
                                />
                                {isInactive && (
                                  <span className="text-sm text-muted-foreground">Inativo</span>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {enablePagination && totalPages > 1 && !loading && (
              <div className="flex items-center justify-between px-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, tab.data.length)} de{" "}
                  {tab.data.length} registros
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(tab.value, currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Anterior</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Mostra apenas páginas próximas (max 5 botões)
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!showPage) {
                        // Mostra "..." entre as páginas
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(tab.value, page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(tab.value, currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline mr-1">Próxima</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
