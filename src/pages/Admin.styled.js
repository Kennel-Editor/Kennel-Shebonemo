import styled from "styled-components";

export const Wrap = styled.div`
  padding: 32px 24px;
  max-width: 1100px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.title};
  margin: 0 0 12px;
`;

export const Sub = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
`;

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const KPICard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  padding: 20px;
  border: 1px solid #eee;
`;

export const KPIName = styled.div`
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 8px;
`;

export const KPIValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  border: 1px solid #eee;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.accentTransparent};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  &:not(:first-child) {
    text-align: right;
  }
`;

export const Td = styled.td`
  padding: 14px 16px;
  border-top: 1px solid #f1f1f1;
  color: ${({ theme }) => theme.colors.text};
  &:not(:first-child) {
    text-align: right;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid #eee;
  font-size: 12px;
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  margin: 28px 0 12px;
  font-size: 22px;
`;

export const Btn = styled.button`
  border: 1px solid #e6e6e6;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

/* ========== RULLERENDE KORT GRID & STYLES ========== */

export const RangeGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 8px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const RangeSection = styled.div`
  display: grid;
`;

export const RangeCardWrap = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
  border: 1px solid #eee;
  padding: 16px;
  display: grid;
  gap: 8px;
`;

export const RangeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RangeTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const RangeNav = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const BtnIcon = styled.button`
  border: 1px solid #e6e6e6;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
  line-height: 1;
  &:hover {
    opacity: 0.9;
  }
`;

export const RangeLabel = styled.div`
  font-size: 14px;
  opacity: 0.75;
`;

export const RangeMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: end;
`;

export const Metric = styled.div``;

export const MetricName = styled.div`
  font-size: 12px;
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;
