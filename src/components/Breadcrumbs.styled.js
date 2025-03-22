import { Breadcrumb } from "react-bootstrap";
import styled from "styled-components";

export const StyledBreadcrumb = styled(Breadcrumb)`
  background-color: transparent;
  padding: 10px 0;
  margin: 0px 1rem;
  
  }
   .separator {
      font-weight: 900;
      margin: 0px 0.3rem;
   
    }
      a {
    color: ${(props) => props.theme.colors.accent};
    text-decoration: none;
  }
        
`;

export const StyledBreadcrumbItem = styled(Breadcrumb.Item)`
  font-size: 1rem;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }

  &.active {
    color: ${(props) => props.theme.colors.primary};
    &.pointer {
      pointer-events: none;
    }
  }
`;
