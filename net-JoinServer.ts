// Transfer Server
import { CommandPermissionLevel, PlayerCommandSelector } from "bdsx/bds/command";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { TransferPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { command } from "bdsx/command";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { CxxString, int32_t } from "bdsx/nativetype";
import { BuildPlatform } from "bdsx/common";
export function transferServer(NetworkIdentifier: NetworkIdentifier, address: string, port: number): void {
    const transferPacket = TransferPacket.allocate();
    transferPacket.address = address;
    transferPacket.port = port;
    transferPacket.sendTo(NetworkIdentifier);
    transferPacket.dispose();
}

command.register("join", "Teleport selected players to join specific server by given address/ports",CommandPermissionLevel.Operator).overload(
    (params, origin, output) => {
        const actor = origin.getEntity();
        if (actor?.isPlayer()) actor.transferServer(params.address, params.port);
        for(const players of params.target.newResults(origin, ServerPlayer)){
            const serverPlayers = players.getNetworkIdentifier();
            transferServer(serverPlayers, params.address, params.port)
            output.success(`§2|Successfully Sent player or players to the server`.green)
        }
    },
    {   
        address: CxxString,
        port: int32_t,
        target: PlayerCommandSelector,
    },
);