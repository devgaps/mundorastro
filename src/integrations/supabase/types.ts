export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      caderno_campo: {
        Row: {
          created_at: string
          data: string
          dosagem: string | null
          id: string
          observacoes: string | null
          produto: string | null
          propriedade_id: string | null
          responsavel: string | null
          status: string | null
          talhao_id: string | null
          tipo_atividade: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          dosagem?: string | null
          id?: string
          observacoes?: string | null
          produto?: string | null
          propriedade_id?: string | null
          responsavel?: string | null
          status?: string | null
          talhao_id?: string | null
          tipo_atividade: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          dosagem?: string | null
          id?: string
          observacoes?: string | null
          produto?: string | null
          propriedade_id?: string | null
          responsavel?: string | null
          status?: string | null
          talhao_id?: string | null
          tipo_atividade?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "caderno_campo_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caderno_campo_talhao_id_fkey"
            columns: ["talhao_id"]
            isOneToOne: false
            referencedRelation: "talhoes"
            referencedColumns: ["id"]
          },
        ]
      }
      compras: {
        Row: {
          categoria: string | null
          created_at: string
          data_compra: string
          data_entrega: string | null
          fornecedor: string
          id: string
          itens: number | null
          numero: string | null
          observacoes: string | null
          status: string | null
          updated_at: string
          user_id: string
          valor_total: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_compra?: string
          data_entrega?: string | null
          fornecedor: string
          id?: string
          itens?: number | null
          numero?: string | null
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          valor_total?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_compra?: string
          data_entrega?: string | null
          fornecedor?: string
          id?: string
          itens?: number | null
          numero?: string | null
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          valor_total?: number | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          escopo: string | null
          id: string
          updated_at: string
          user_id: string
          valor: Json
        }
        Insert: {
          chave: string
          created_at?: string
          escopo?: string | null
          id?: string
          updated_at?: string
          user_id: string
          valor?: Json
        }
        Update: {
          chave?: string
          created_at?: string
          escopo?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          valor?: Json
        }
        Relationships: []
      }
      documentos: {
        Row: {
          created_at: string
          formato: string | null
          id: string
          nome: string
          observacoes: string | null
          propriedade_id: string | null
          status: string | null
          storage_bucket: string | null
          storage_path: string | null
          tamanho_bytes: number | null
          tipo: string | null
          updated_at: string
          url: string | null
          user_id: string
          validade: string | null
        }
        Insert: {
          created_at?: string
          formato?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          propriedade_id?: string | null
          status?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          tamanho_bytes?: number | null
          tipo?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
          validade?: string | null
        }
        Update: {
          created_at?: string
          formato?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          propriedade_id?: string | null
          status?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          tamanho_bytes?: number | null
          tipo?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
          validade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos: {
        Row: {
          ano: number | null
          created_at: string
          horas_uso: number | null
          id: string
          identificacao: string | null
          marca: string | null
          modelo: string | null
          nome: string
          observacoes: string | null
          proxima_manutencao: string | null
          propriedade_id: string | null
          quilometragem: number | null
          status: string | null
          tipo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ano?: number | null
          created_at?: string
          horas_uso?: number | null
          id?: string
          identificacao?: string | null
          marca?: string | null
          modelo?: string | null
          nome: string
          observacoes?: string | null
          proxima_manutencao?: string | null
          propriedade_id?: string | null
          quilometragem?: number | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ano?: number | null
          created_at?: string
          horas_uso?: number | null
          id?: string
          identificacao?: string | null
          marca?: string | null
          modelo?: string | null
          nome?: string
          observacoes?: string | null
          proxima_manutencao?: string | null
          propriedade_id?: string | null
          quilometragem?: number | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipamentos_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      etiquetas: {
        Row: {
          codigo: string
          conteudo: string | null
          created_at: string
          id: string
          impressoes: number | null
          lote_id: string | null
          produto: string | null
          quantidade: number | null
          status: string | null
          tipo: string | null
          unidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          codigo: string
          conteudo?: string | null
          created_at?: string
          id?: string
          impressoes?: number | null
          lote_id?: string | null
          produto?: string | null
          quantidade?: number | null
          status?: string | null
          tipo?: string | null
          unidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          codigo?: string
          conteudo?: string | null
          created_at?: string
          id?: string
          impressoes?: number | null
          lote_id?: string | null
          produto?: string | null
          quantidade?: number | null
          status?: string | null
          tipo?: string | null
          unidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etiquetas_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_rastreabilidade"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque: {
        Row: {
          categoria: string | null
          codigo: string | null
          created_at: string
          id: string
          localizacao: string | null
          nome: string
          observacoes: string | null
          quantidade: number | null
          quantidade_minima: number | null
          ultima_movimentacao: string | null
          unidade: string | null
          updated_at: string
          user_id: string
          valor_unitario: number | null
        }
        Insert: {
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          id?: string
          localizacao?: string | null
          nome: string
          observacoes?: string | null
          quantidade?: number | null
          quantidade_minima?: number | null
          ultima_movimentacao?: string | null
          unidade?: string | null
          updated_at?: string
          user_id: string
          valor_unitario?: number | null
        }
        Update: {
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          id?: string
          localizacao?: string | null
          nome?: string
          observacoes?: string | null
          quantidade?: number | null
          quantidade_minima?: number | null
          ultima_movimentacao?: string | null
          unidade?: string | null
          updated_at?: string
          user_id?: string
          valor_unitario?: number | null
        }
        Relationships: []
      }
      expedicao: {
        Row: {
          cliente: string | null
          created_at: string
          data_expedicao: string
          destino: string | null
          id: string
          lote_id: string | null
          numero: string | null
          observacoes: string | null
          quantidade: number | null
          status: string | null
          transportadora: string | null
          unidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente?: string | null
          created_at?: string
          data_expedicao?: string
          destino?: string | null
          id?: string
          lote_id?: string | null
          numero?: string | null
          observacoes?: string | null
          quantidade?: number | null
          status?: string | null
          transportadora?: string | null
          unidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente?: string | null
          created_at?: string
          data_expedicao?: string
          destino?: string | null
          id?: string
          lote_id?: string | null
          numero?: string | null
          observacoes?: string | null
          quantidade?: number | null
          status?: string | null
          transportadora?: string | null
          unidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedicao_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_rastreabilidade"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          categoria: string | null
          created_at: string
          data: string
          descricao: string
          forma_pagamento: string | null
          id: string
          observacoes: string | null
          status: string | null
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data?: string
          descricao: string
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo: string
          updated_at?: string
          user_id: string
          valor?: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data?: string
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      lotes_rastreabilidade: {
        Row: {
          codigo: string
          created_at: string
          data_producao: string | null
          id: string
          observacoes: string | null
          produto: string
          propriedade_id: string | null
          qr_code: string | null
          quantidade: number | null
          safra_id: string | null
          status: string | null
          talhao_id: string | null
          unidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          codigo: string
          created_at?: string
          data_producao?: string | null
          id?: string
          observacoes?: string | null
          produto: string
          propriedade_id?: string | null
          qr_code?: string | null
          quantidade?: number | null
          safra_id?: string | null
          status?: string | null
          talhao_id?: string | null
          unidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          codigo?: string
          created_at?: string
          data_producao?: string | null
          id?: string
          observacoes?: string | null
          produto?: string
          propriedade_id?: string | null
          qr_code?: string | null
          quantidade?: number | null
          safra_id?: string | null
          status?: string | null
          talhao_id?: string | null
          unidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lotes_rastreabilidade_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lotes_rastreabilidade_safra_id_fkey"
            columns: ["safra_id"]
            isOneToOne: false
            referencedRelation: "safras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lotes_rastreabilidade_talhao_id_fkey"
            columns: ["talhao_id"]
            isOneToOne: false
            referencedRelation: "talhoes"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_estoque: {
        Row: {
          created_at: string
          data: string
          estoque_id: string | null
          id: string
          motivo: string | null
          observacoes: string | null
          quantidade: number
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          estoque_id?: string | null
          id?: string
          motivo?: string | null
          observacoes?: string | null
          quantidade: number
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          estoque_id?: string | null
          id?: string
          motivo?: string | null
          observacoes?: string | null
          quantidade?: number
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_estoque_id_fkey"
            columns: ["estoque_id"]
            isOneToOne: false
            referencedRelation: "estoque"
            referencedColumns: ["id"]
          },
        ]
      }
      producao: {
        Row: {
          created_at: string
          data: string
          id: string
          observacoes: string | null
          produto: string
          qualidade: string | null
          quantidade: number | null
          safra_id: string | null
          talhao_id: string | null
          unidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: string
          id?: string
          observacoes?: string | null
          produto: string
          qualidade?: string | null
          quantidade?: number | null
          safra_id?: string | null
          talhao_id?: string | null
          unidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          observacoes?: string | null
          produto?: string
          qualidade?: string | null
          quantidade?: number | null
          safra_id?: string | null
          talhao_id?: string | null
          unidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "producao_safra_id_fkey"
            columns: ["safra_id"]
            isOneToOne: false
            referencedRelation: "safras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producao_talhao_id_fkey"
            columns: ["talhao_id"]
            isOneToOne: false
            referencedRelation: "talhoes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      propriedades: {
        Row: {
          area_total: number | null
          car: string | null
          cidade: string | null
          created_at: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          proprietario: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area_total?: number | null
          car?: string | null
          cidade?: string | null
          created_at?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          proprietario?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area_total?: number | null
          car?: string | null
          cidade?: string | null
          created_at?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          proprietario?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      safras: {
        Row: {
          area: number | null
          created_at: string
          cultura: string | null
          data_colheita_prevista: string | null
          data_plantio: string | null
          id: string
          nome: string
          observacoes: string | null
          progresso: number | null
          propriedade_id: string | null
          status: string | null
          talhao_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area?: number | null
          created_at?: string
          cultura?: string | null
          data_colheita_prevista?: string | null
          data_plantio?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          progresso?: number | null
          propriedade_id?: string | null
          status?: string | null
          talhao_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: number | null
          created_at?: string
          cultura?: string | null
          data_colheita_prevista?: string | null
          data_plantio?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          progresso?: number | null
          propriedade_id?: string | null
          status?: string | null
          talhao_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safras_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safras_talhao_id_fkey"
            columns: ["talhao_id"]
            isOneToOne: false
            referencedRelation: "talhoes"
            referencedColumns: ["id"]
          },
        ]
      }
      talhoes: {
        Row: {
          area: number | null
          created_at: string
          cultura: string | null
          id: string
          nome: string
          observacoes: string | null
          propriedade_id: string | null
          status: string | null
          updated_at: string
          user_id: string
          variedade: string | null
        }
        Insert: {
          area?: number | null
          created_at?: string
          cultura?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          propriedade_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          variedade?: string | null
        }
        Update: {
          area?: number | null
          created_at?: string
          cultura?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          propriedade_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          variedade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talhoes_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "operator"],
    },
  },
} as const
