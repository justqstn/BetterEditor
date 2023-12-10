try {
	// Better EDITOR от just_qstn
// All rights reversed - все права защищены

/*
 Функции, которые вы можете использовать в режиме:
Admin(roomid) - выдает/забирает админку по roomid
Ban(roomid) - банит игрока по roomid
Cls() - убирает все зоны с тегом cmd
ipc_GetStructure(area) - проверяет выделенную зону (area), создает структуру в виде строки и выводит ее
*/



// Константы
const ADMIN = "9DE9DFD7D1F5C16A", BANNED = "", COLORS = ["#FF0000", "#FFA500", "#FFD700", "#32CD32", "#AFEEEE", "#1E90FF", "#8A2BE2"]

// Переменные

// Создание команд
Teams.Add("players", "<i><B><size=38>И</size><size=30>гроки</size></B>\nbetter! editor</i>", rgb(70, 130, 180));
Teams.Add("builders", "<i><B><size=38>С</size><size=30>троители</size></B>\nbetter! editor</i>", rgb(153, 50, 204));
Teams.Add("better", "<i><B><size=38>У</size><size=30>дачи!</size></B>\nbetter! editor</i>", rgb(0, 0, 0));
let p_team = Teams.Get("players"), b_team = Teams.Get("builders");

// Настройки
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = true;
BreackGraph.BreackAll = true;
Spawns.GetContext().RespawnTime.Value = 0;
Ui.GetContext().QuadsCount.Value = true;
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;
Build.GetContext().CollapseChangeEnable.Value = true;
Build.GetContext().FlyEnable.Value = true;

if (GameMode.Parameters.GetBool("1hp")) contextedProperties.GetContext().MaxHp.Value = 1;
if (GameMode.Parameters.GetBool("10000hp")) contextedProperties.GetContext(b_team).MaxHp.Value = 10000;
if (GameMode.Parameters.GetBool("godmode_admin")) b_team.Damage.DamageIn.Value = false;
if (GameMode.Parameters.GetBool("godmode_people")) p_team.Damage.DamageIn.Value = false;

// Интерфейс
LeaderBoard.PlayerLeaderBoardValues = [
	{
		Value: "rid",
		DisplayName: "<B>r</B>аid",
		ShortDisplayName: "<B>r</B>id"
	},
	{
		Value: "banned",
		DisplayName: "<B>z</B>абанен",
		ShortDisplayName: "<B>z</B>абанен"
	}
];

Ui.GetContext().TeamProp1.Value = {
	Team: "better", Prop: "hint"
};
Ui.GetContext().TeamProp2.Value = {
	Team: "better", Prop: "hint"
};
Teams.Get("better").Properties.Get("hint").Value = "<B><color=#483D8B>Better!</color> EDITOR</B><i>\n\nby just_qstn</i>";
p_team.Spawns.SpawnPointsGroups.Add(1);
b_team.Spawns.SpawnPointsGroups.Add(2);

// События
Teams.OnAddTeam.Add(function (t) {
	let bl = t.Id == "players" ? false : true;
	Build.GetContext(t).Pipette.Value = bl;
	Build.GetContext(t).FloodFill.Value = bl;
	Build.GetContext(t).FillQuad.Value = bl;
	Build.GetContext(t).RemoveQuad.Value = bl;
	Build.GetContext(t).BalkLenChange.Value = bl;
	Build.GetContext(t).SetSkyEnable.Value = bl;
	Build.GetContext(t).GenMapEnable.Value = bl;
	Build.GetContext(t).ChangeCameraPointsEnable.Value = bl;
	Build.GetContext(t).QuadChangeEnable.Value = bl;
	Build.GetContext(t).BuildModeEnable.Value = bl;
	Build.GetContext(t).RenameMapEnable.Value = bl;
	Build.GetContext(t).ChangeMapAuthorsEnable.Value = bl;
	Build.GetContext(t).LoadMapEnable.Value = bl;
	Build.GetContext(t).ChangeSpawnsEnable.Value = bl;
	Build.GetContext(t).BuildRangeEnable.Value = bl;
	Inventory.GetContext(t).Main.Value = bl;
	Inventory.GetContext(t).MainInfinity.Value = bl;
	Inventory.GetContext(t).Secondary.Value = bl;
	Inventory.GetContext(t).SecondaryInfinity.Value = bl;
	Inventory.GetContext(t).Melee.Value = bl;
	Inventory.GetContext(t).BuildInfinity.Value = bl;
	Inventory.GetContext(t).Build.Value = bl;
	Inventory.GetContext(t).Explosive.Value = bl;
	Inventory.GetContext(t).ExplosiveInfinity.Value = bl;
});

Teams.OnRequestJoinTeam.Add(e_join);
Players.OnPlayerConnected.Add(e_join);

function e_join(p) {
	if (p.IdInRoom == 1 || p.Id == ADMIN) Properties.GetContext().Get("team" + p.Id).Value = "builders";
    p.Properties.Get("banned").Value = Properties.GetContext().Get("banned" + p.Id).Value || false;
	p.Properties.Get("rid").Value = p.IdInRoom;
	let team = Properties.GetContext().Get("team" + p.Id).Value || "players";
	Teams.Get(team).Add(p);
}

Teams.OnPlayerChangeTeam.Add(function (p) {
    p.Spawns.Spawn();
    p.Spawns.Spawn();
	if (p.Properties.Get("banned").Value) p.Spawns.Despawn();
});

Players.OnPlayerDisconnected.Add(function(p) {
	Properties.GetContext().Get("banned" + p.Id).Value = p.Properties.Get("banned").Value;
});

// Таймеры
if (GameMode.Parameters.GetBool("gradient")) Timers.GetContext().Get("inf").RestartLoop(1);
Timers.GetContext().Get("inf").OnTimer.Add(function () {
	let indx = COLORS.indexOf(Teams.Get("better").Properties.Get("hint").Value.slice(10, 17));
	if (indx < COLORS.length - 1) indx++;
	else indx = 0;
	Teams.Get("better").Properties.Get("hint").Value = "<B><color=" + COLORS[indx] + ">Better!</color> EDITOR</B><i>\n\nby just_qstn</i>";
});

// Зоны
AddArea({name: "cmd", tags: ["cmd"], view_enable: true, trg_enable: true, color: {r: 1, g: 1, b: 1}, event: CmdTrigger});

// Функции
function rgb(rc, gc, bc) {
	return { r: rc / 255, g: gc / 255, b: bc / 255 };
}

function AddArea(params) {
    let t = AreaPlayerTriggerService.Get(params.name), v = AreaViewService.GetContext().Get(params.name);
    t.Tags = params.tags;
    v.Tags = params.tags;
    t.Enable = params.trg_enable;
    v.Enable = params.view_enable;
    v.Color = params.color;
    t.OnEnter.Add(params.event);
}

function CmdTrigger(p, a) {
    if (p.Team != b_team) return;
	try {
		eval(String(a.Name).split("$").join("."));
	} catch(e) { p.Ui.Hint.Value = e.name + "\n" + e.message; }
}

function Ban(id) {
	let p = Players.GetByRoomId(id);
	if (p.Id == ADMIN) return;
	if (p.Properties.Get("banned").Value) {
		p.Properties.Get("banned").Value = false;
		p.Spawns.Spawn();
	} else {
		p.Properties.Get("banned").Value = true;
		p.Spawns.Despawn();
	}
}

function Admin(id) {
	let p = Players.GetByRoomId(id);
	if (p.Id == ADMIN) return;
	if (p.Team == p_team) {
		b_team.Add(p);
		Properties.GetContext().Get("team" + p.Id).Value = "builders"
	}
	else {
		p_team.Add(p);
		Properties.GetContext().Get("team" + p.Id).Value = "players";
	}
}

function ipc_GetStructure(area)
{
	let result = "";
	e = area.Ranges.GetEnumerator();
	e.moveNext();
	let start = e.Current.Start, end = e.Current.End;
	for (let x = start.x; x < Math.sqrt(start.x * start.x + end.x * end.x); x += (x > end.x ? 1 : -1))
	{
		for (let y = start.y; y < Math.sqrt(start.y * start.y + end.y * end.y); y += (y > end.y ? 1 : -1))
		{
			for (let z = start.z; z < Math.sqrt(start.z * start.z + end.z * end.z); z += (z > end.z ? 1 : -1))
			{
				if (MapEditor.GetBlockId(x, y, z) != 0)
				{
					result += x + "," + y + "," + z + "|" + MapEditor.GetBlockId(x, y, z) + "::";
				}
			}
		}
	}
	msg.Show(result.slice(0, -2));
	return result.slice(0, -2);
} } catch(e) { Validate.ReportInvalid(e.name + " " + e.message); }
