-- Função para listar transações por mês
CREATE OR REPLACE FUNCTION getlistmonth(mes integer) 
RETURNS SETOF transation
LANGUAGE sql AS $$
  SELECT * FROM transation WHERE extract(month FROM created_at) = mes;
$$;

-- Função para listar transações por dia
CREATE OR REPLACE FUNCTION getlistday(dia integer) 
RETURNS SETOF transation
LANGUAGE sql AS $$
  SELECT * FROM transation WHERE extract(day FROM created_at) = dia;
$$;

-- Função para listar transações por período
CREATE OR REPLACE FUNCTION getlistperiodo(inicio text, fim text) 
RETURNS SETOF transation
LANGUAGE sql AS $$
  SELECT * FROM transation 
  WHERE (DATE(created_at) >= DATE(inicio)) AND (DATE(created_at) <= DATE(fim));
$$;
