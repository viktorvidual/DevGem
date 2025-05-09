import React, { Fragment, useContext, useState } from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
// icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { Order, useFilters } from './table.utils.ts';
import RowMenu from './AddonsTableRowMenu.tsx';
import moment from 'moment';
import { WarningAmber } from '@mui/icons-material';
import { ADDONS_PER_PAGE, ADMIN, DESC, DETAILED_ADDON_VIEW_ID_PATH, SIMPLE_DATE_FORMAT } from '../../common/common.ts';
import { useNavigate } from 'react-router-dom';
import AddonsTableFilters from './AddonsTableFilters.tsx';
import { Link } from '@mui/joy';
import AddonsTableHeader from './AddonsTableHeader.tsx';
import Pagination from '../../views/Pagination/Pagination.tsx';
import { Addon } from '../../context/AddonsContext.ts';
import { updateAddonFeatureStatus } from '../../services/addon.services.ts';
import { AuthContext } from '../../context/AuthContext.ts';
import _ from 'lodash';

export default function AddonsTablePrivate() {
  const [order, setOrder] = useState<Order>(DESC);
  const [addonsOnPage, setAddonsOnPage] = useState<Addon[]>([]);
  const { allUsers, loggedInUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const {
    filteredAddons,
    targetIDEs,
    tags,
    setValueSearch,
    setValueStatus,
    setValueTag,
    setValueTargetIDE } = useFilters(order);

  const navigate = useNavigate();

  /**
 * Function to handle view details event and navigate to detailed view.
 *
 * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event.
 * @param {string} id - The id.
 */
  const handleViewDetails = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    navigate(`${DETAILED_ADDON_VIEW_ID_PATH}${id}`);
  }

  return (
    <>
      <Fragment>
        <Sheet
          className="SearchAndFilters-mobile"
          sx={{
            display: {
              xs: 'flex',
              sm: 'none',
            },
            my: 1,
            gap: 1,
          }}
        >
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            <FilterAltIcon />
          </IconButton>
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
              <ModalClose />
              <Typography id="filter-modal" level="h2">
                Filters
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AddonsTableFilters setValueStatus={setValueStatus}
                  setValueTargetIDE={setValueTargetIDE}
                  setValueSearch={setValueSearch}
                  setValueTag={setValueTag}
                  targetIDEs={targetIDEs}
                  tags={tags} />
                <Button color="primary" onClick={() => setOpen(false)}>
                  Submit
                </Button>
              </Sheet>
            </ModalDialog>
          </Modal>
        </Sheet>
        <Box
          className="SearchAndFilters-tabletUp"
          sx={{
            borderRadius: 'sm',
            py: 2,
            display: {
              xs: 'none',
              sm: 'flex',
            },
            flexWrap: 'wrap',
            gap: 1.5,
            '& > *': {
              minWidth: {
                xs: '120px',
                md: '160px',
              },
            },
          }}
        >

          <AddonsTableFilters setValueStatus={setValueStatus}
            setValueTargetIDE={setValueTargetIDE}
            setValueTag={setValueTag}
            setValueSearch={setValueSearch}
            targetIDEs={targetIDEs}
            tags={tags} />
        </Box>
        <Sheet
          className="OrderTableContainer"
          variant="outlined"
          sx={{
            display: { xs: 'none', sm: 'initial' },
            width: '100%',
            borderRadius: 'sm',
            flexShrink: 1,
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          <Table
            aria-labelledby="addonsTable"
            stickyHeader
            hoverRow
            sx={{
              '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
              '--Table-headerUnderlineThickness': '1px',
              '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
              '--TableCell-paddingY': '4px',
              '--TableCell-paddingX': '8px',
              tableLayout: "auto"
            }}
          >
            <AddonsTableHeader order={order} setOrder={setOrder} />
            <tbody>
              {addonsOnPage?.map((addon: Addon) => (
                <tr key={addon.addonId}>
                  <td>
                    <Typography textAlign="left" level="body-xs">{moment(addon.createdOn).format(SIMPLE_DATE_FORMAT)}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                      <div>
                        <Typography level="body-xs">{addon.name}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                      <div>
                        <Typography level="body-xs">{addon.targetIDE}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        {
                          published: <CheckRoundedIcon fontSize="small" />,
                          draft: <WarningAmber fontSize="small" />,
                          pending: <AutorenewRoundedIcon fontSize="small" />,
                          rejected: <BlockIcon fontSize="small" />,
                        }[addon.status]
                      }
                      color={
                        {
                          published: 'success',
                          draft: 'warning',
                          pending: 'neutral',
                          rejected: 'danger',
                        }[addon.status] as ColorPaletteProp
                      }
                    >
                      {addon.status}
                    </Chip>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                      <div>
                        <Typography level="body-xs">{Object.keys(addon.tags).join()}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                      <div>
                        <Typography level="body-xs">@{allUsers?.find(el => el.uid === addon.ownerUid)?.username}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'left', width: 100 }}>
                      <Link level="body-xs" href='' onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleViewDetails(e, addon.addonId)}>
                        View
                      </Link>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                      <Link level="body-xs" href={addon.downloadLink}>
                        Download
                      </Link>
                      <RowMenu {...addon} />
                    </Box>
                  </td>
                  {loggedInUser?.role === ADMIN && <td>
                    {addon.featured ? (
                      <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                        <Button
                          onClick={() => { updateAddonFeatureStatus(addon.addonId, false) }}
                          variant="outlined"
                          size='sm'
                          style={{ fontSize: "0.8em", fontWeight: 500, borderRadius: "10px", width: 100 }}
                        >
                          Remove from featured
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2, textAlign: 'left' }}>
                        <Button onClick={() => { updateAddonFeatureStatus(addon.addonId, true) }}
                          size="sm"
                          variant="outlined"
                          style={{ fontSize: "0.8em", fontWeight: 500, borderRadius: "10px", width: 100 }}>
                          Add to featured
                        </Button>
                      </Box>
                    )}
                  </td>}
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
        <Pagination data={filteredAddons} itemsPerPage={ADDONS_PER_PAGE} setData={setAddonsOnPage} />
      </Fragment>
    </>
  );
}
