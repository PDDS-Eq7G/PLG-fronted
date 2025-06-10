
export type CellType = 'empty' | 'central' | 'intermediate' | 'truck' | 'blocked' | 'order';

export interface GridCellData {

    x: number;
    y: number;
    type: CellType;
    id?: string; 
}